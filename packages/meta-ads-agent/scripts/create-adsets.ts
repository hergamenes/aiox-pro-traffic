import { getAccessToken } from '../src/auth/token-manager.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const AD_ACCOUNT_ID = '416838927672559';
const CAMPAIGN_ID = '120243587818310744';
const PAGE_ID = '1646687212287892';
const INSTAGRAM_ID = '17841403089717017';
const PIXEL_ID = '302959204691352';

// 13 vídeos encontrados
const VIDEOS = [
  { num: '01', id: '915522834418259', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_01' },
  { num: '02', id: '1666508461445708', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_02' },
  { num: '03', id: '2274271336316937', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_03' },
  { num: '04', id: '3446567675482745', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_04' },
  { num: '05', id: '1649053709610990', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_05' },
  { num: '06', id: '1460334479215711', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_06' },
  { num: '07', id: '890546587150489', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_07' },
  { num: '08', id: '1140556701445825', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_08' },
  { num: '09', id: '1251272749822167', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_09' },
  { num: '10', id: '943727731442975', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_10' },
  { num: '11', id: '1418044916316020', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_11' },
  { num: '12', id: '2142431493223479', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_12' },
  { num: '13', id: '763332853266441', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_13' },
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

// Start time: today at 12:00 BRT (UTC-3)
const today = new Date();
const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
const START_ISO = startTime.toISOString().replace(/\.\d{3}Z$/, '-0300');

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

  // Targeting (replicado dos ad sets existentes)
  const targeting = {
    age_max: 65,
    age_min: 23,
    excluded_custom_audiences: [
      { id: '120217103207320744' }, // [SITE] Lead - 30D
      { id: '120240967755650744' }, // [SITE] Compra - 90D
    ],
    geo_locations: {
      countries: ['BR'],
      location_types: ['home', 'recent'],
    },
    targeting_automation: {
      advantage_audience: 1,
    },
  };

  console.log(`📋 Criando 13 ad sets + 13 anúncios na campanha...\n`);
  console.log(`   Campanha: ${CAMPAIGN_ID}`);
  console.log(`   Início: ${START_ISO}`);
  console.log(`   Orçamento: R$ 50,00/dia por ad set\n`);

  let successAdSets = 0;
  let successAds = 0;
  let failed = 0;

  for (const video of VIDEOS) {
    const adSetName = `VK_CA00_LMT_LEADS_CADASTRO_NR1-6_MAR-26_FRIO_LIVE-QUARTA_LEVA-09.03_AD ${video.title}`;
    const adName = video.title;

    console.log(`\n📌 [${video.num}/13] ${adSetName}`);

    // 1. Create Ad Set
    process.stdout.write('   Criando ad set...');
    const adSetBody = {
      campaign_id: CAMPAIGN_ID,
      name: adSetName,
      status: 'ACTIVE',
      daily_budget: '5000', // R$ 50,00 em centavos
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'OFFSITE_CONVERSIONS',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      targeting,
      promoted_object: {
        pixel_id: PIXEL_ID,
        custom_event_type: 'LEAD',
      },
      start_time: START_ISO,
    };

    const adSetResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adsets`, adSetBody, token);

    if (adSetResult['error']) {
      console.log(` ❌`);
      console.log(`   Erro: ${JSON.stringify(adSetResult['error'])}`);
      failed++;
      continue;
    }

    const adSetId = adSetResult['id'] as string;
    console.log(` ✅ (${adSetId})`);
    successAdSets++;

    // 2. Get video thumbnail
    const thumbnailUrl = await getVideoThumbnail(video.id, token);

    // 3. Create Ad Creative
    process.stdout.write('   Criando criativo...');
    const creativeBody = {
      name: `Creative_${adName}`,
      object_story_spec: {
        page_id: PAGE_ID,
        instagram_user_id: INSTAGRAM_ID,
        video_data: {
          video_id: video.id,
          message: AD_TEXT,
          title: HEADLINE,
          link_description: DESCRIPTION,
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              link: WEBSITE_URL,
            },
          },
          image_url: thumbnailUrl || undefined,
        },
      },
      url_tags: URL_TAGS,
      degrees_of_freedom_spec: {
        creative_features_spec: {
          standard_enhancements: {
            enroll_status: 'OPT_IN',
          },
        },
      },
    };

    const creativeResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adcreatives`, creativeBody, token);

    if (creativeResult['error']) {
      console.log(` ❌`);
      console.log(`   Erro: ${JSON.stringify(creativeResult['error'])}`);
      // Try to clean up the ad set
      failed++;
      continue;
    }

    const creativeId = creativeResult['id'] as string;
    console.log(` ✅ (${creativeId})`);

    // 4. Create Ad
    process.stdout.write('   Criando anúncio...');
    const adBody = {
      adset_id: adSetId,
      name: adName,
      status: 'ACTIVE',
      creative: { creative_id: creativeId },
    };

    const adResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/ads`, adBody, token);

    if (adResult['error']) {
      console.log(` ❌`);
      console.log(`   Erro: ${JSON.stringify(adResult['error'])}`);
      failed++;
      continue;
    }

    const adId = adResult['id'] as string;
    console.log(` ✅ (${adId})`);
    successAds++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Resultado:`);
  console.log(`   ✅ Ad sets criados: ${successAdSets}/13`);
  console.log(`   ✅ Anúncios criados: ${successAds}/13`);
  if (failed > 0) console.log(`   ❌ Falhas: ${failed}`);
  console.log(`\n🔗 Ver no Ads Manager:`);
  console.log(`   https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID}&campaign_id=${CAMPAIGN_ID}`);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
