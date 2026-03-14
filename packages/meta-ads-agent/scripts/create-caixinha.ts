import { getAccessToken } from '../src/auth/token-manager.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const AD_ACCOUNT_ID = '416838927672559';
const CAMPAIGN_ID = '120243587818310744';
const PAGE_ID = '1646687212287892';
const INSTAGRAM_ID = '17841403089717017';
const PIXEL_ID = '302959204691352';

const VIDEOS = [
  { id: '1412954510049764', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_01' },
  { id: '1724362405448581', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_02' },
  { id: '1458533306064572', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_03' },
  { id: '1581118306515513', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_04' },
  { id: '1443023653846468', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_06' },
  { id: '929434656203096', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_07' },
  { id: '3483219868496823', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_08' },
  { id: '914602044544694', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_09' },
  { id: '1988560298729967', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_10' },
  { id: '895149966665822', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_11' },
  { id: '1228322225682175', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_12' },
  { id: '1644823150275137', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_13' },
  { id: '1218000370102127', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_14' },
  { id: '1652684585880775', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_15' },
  { id: '26646884444936226', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_16' },
  { id: '1273186804946736', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_17' },
  { id: '920722104025316', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_18' },
  { id: '3339126236266672', title: 'FELIPE - REELS - CAIXINHA - AULA DE QUARTA_19' },
];

const AD_TEXT = `Nesta quarta-feira, 20h acontece minha última aula aberta ao público sobre NR-1 na Prática.

Vou mostrar os bastidores e como fazer o Diagnóstico de Riscos Psicossociais.

Te espero nesta quarta-feira, 20h. Clique para entrar no grupo e receber o link da aula de quarta-feira.

Abraços,

Felipe Maronesi.`;

const HEADLINE = 'Diagnóstico de Riscos Psicossociais em apenas 60 minutos.';
const DESCRIPTION = 'Diagnóstico de Riscos Psicossociais em apenas 60 minutos.';
const WEBSITE_URL = 'https://metodobelieve.com.br/nr-1-drps/';
const URL_TAGS = 'utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&vk_source=paid_metaads&vk_ad_id={{ad.id}}';

const today = new Date();
const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
const START_ISO = startTime.toISOString().replace(/\.\d{3}Z$/, '-0300');

const targeting = {
  age_max: 65,
  age_min: 23,
  excluded_custom_audiences: [
    { id: '120217103207320744' },
    { id: '120240967755650744' },
  ],
  geo_locations: {
    countries: ['BR'],
    location_types: ['home', 'recent'],
  },
  targeting_automation: {
    advantage_audience: 1,
  },
};

async function apiPost(url: string, body: Record<string, unknown>, token: string): Promise<Record<string, unknown>> {
  const payload = { ...body, access_token: token };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return (await response.json()) as Record<string, unknown>;
}

async function getVideoThumbnail(videoId: string, token: string): Promise<string> {
  const url = `${BASE_URL}/${videoId}?fields=picture&access_token=${token}`;
  const res = await fetch(url);
  const json = (await res.json()) as Record<string, unknown>;
  return (json['picture'] as string) || '';
}

async function main() {
  console.log('🔑 Obtendo token de acesso...');
  const token = await getAccessToken();
  console.log('✅ Token obtido\n');

  console.log(`📋 Criando 18 ad sets + 18 anúncios (CAIXINHA)...\n`);
  console.log(`   Campanha: ${CAMPAIGN_ID}`);
  console.log(`   Orçamento: R$ 30,00/dia por ad set`);
  console.log(`   Início: ${START_ISO}\n`);

  let successAdSets = 0;
  let successAds = 0;
  let failed = 0;

  for (let i = 0; i < VIDEOS.length; i++) {
    const video = VIDEOS[i];
    const num = (i + 1).toString().padStart(2, '0');
    const adSetName = `VK_CA00_LMT_LEADS_CADASTRO_NR1-6_MAR-26_FRIO_LIVE-QUARTA_LEVA-09.03_AD ${video.title}`;

    console.log(`📌 [${num}/18] ${video.title}`);

    // 1. Create Ad Set
    process.stdout.write('   Ad set...');
    const adSetResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adsets`, {
      campaign_id: CAMPAIGN_ID,
      name: adSetName,
      status: 'ACTIVE',
      daily_budget: '3000',
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'OFFSITE_CONVERSIONS',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      targeting,
      promoted_object: { pixel_id: PIXEL_ID, custom_event_type: 'LEAD' },
      start_time: START_ISO,
    }, token);

    if (adSetResult['error']) {
      console.log(` ❌ ${(adSetResult['error'] as Record<string, unknown>)['message']}`);
      failed++;
      continue;
    }
    const adSetId = adSetResult['id'] as string;
    console.log(` ✅`);
    successAdSets++;

    // 2. Get thumbnail
    const thumbnailUrl = await getVideoThumbnail(video.id, token);

    // 3. Create Creative
    process.stdout.write('   Criativo + anúncio...');
    const creativeResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adcreatives`, {
      name: `Creative_${video.title}`,
      object_story_spec: {
        page_id: PAGE_ID,
        instagram_user_id: INSTAGRAM_ID,
        video_data: {
          video_id: video.id,
          message: AD_TEXT,
          title: HEADLINE,
          link_description: DESCRIPTION,
          call_to_action: { type: 'LEARN_MORE', value: { link: WEBSITE_URL } },
          ...(thumbnailUrl ? { image_url: thumbnailUrl } : {}),
        },
      },
      url_tags: URL_TAGS,
    }, token);

    if (creativeResult['error']) {
      console.log(` ❌ Criativo: ${(creativeResult['error'] as Record<string, unknown>)['message']}`);
      failed++;
      continue;
    }
    const creativeId = creativeResult['id'] as string;

    // 4. Create Ad
    const adResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/ads`, {
      adset_id: adSetId,
      name: video.title,
      status: 'ACTIVE',
      creative: { creative_id: creativeId },
    }, token);

    if (adResult['error']) {
      console.log(` ❌ Anúncio: ${(adResult['error'] as Record<string, unknown>)['message']}`);
      failed++;
      continue;
    }
    console.log(` ✅`);
    successAds++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Resultado:`);
  console.log(`   ✅ Ad sets criados: ${successAdSets}/18`);
  console.log(`   ✅ Anúncios criados: ${successAds}/18`);
  if (failed > 0) console.log(`   ❌ Falhas: ${failed}`);
  console.log(`   💰 Custo diário total: R$ ${(successAdSets * 30).toFixed(2)}`);
}

main().catch(err => { console.error('Erro fatal:', err); process.exit(1); });
