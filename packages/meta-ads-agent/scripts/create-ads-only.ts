import { getAccessToken } from '../src/auth/token-manager.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const AD_ACCOUNT_ID = '416838927672559';
const PAGE_ID = '1646687212287892';
const INSTAGRAM_ID = '17841403089717017';

// Ad sets já criados + vídeos correspondentes
const AD_SETS = [
  { adSetId: '120243634331980744', videoId: '915522834418259', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_01' },
  { adSetId: '120243634333390744', videoId: '1666508461445708', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_02' },
  { adSetId: '120243634337260744', videoId: '2274271336316937', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_03' },
  { adSetId: '120243634338520744', videoId: '3446567675482745', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_04' },
  { adSetId: '120243634339920744', videoId: '1649053709610990', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_05' },
  { adSetId: '120243634348420744', videoId: '1460334479215711', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_06' },
  { adSetId: '120243634350490744', videoId: '890546587150489', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_07' },
  { adSetId: '120243634352570744', videoId: '1140556701445825', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_08' },
  { adSetId: '120243634356440744', videoId: '1251272749822167', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_09' },
  { adSetId: '120243634359440744', videoId: '943727731442975', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_10' },
  { adSetId: '120243634366240744', videoId: '1418044916316020', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_11' },
  { adSetId: '120243634371490744', videoId: '2142431493223479', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_12' },
  { adSetId: '120243634373810744', videoId: '763332853266441', title: 'FELIPE - REELS - 13 FATORES - AULA DE QUARTA_13' },
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

  console.log(`📋 Criando 13 anúncios nos ad sets existentes...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < AD_SETS.length; i++) {
    const { adSetId, videoId, title } = AD_SETS[i];
    const num = (i + 1).toString().padStart(2, '0');

    console.log(`📌 [${num}/13] ${title}`);

    // 1. Get thumbnail
    const thumbnailUrl = await getVideoThumbnail(videoId, token);

    // 2. Create Ad Creative (sem standard_enhancements)
    process.stdout.write('   Criando criativo...');
    const creativeBody: Record<string, unknown> = {
      name: `Creative_${title}`,
      object_story_spec: {
        page_id: PAGE_ID,
        instagram_user_id: INSTAGRAM_ID,
        video_data: {
          video_id: videoId,
          message: AD_TEXT,
          title: HEADLINE,
          link_description: DESCRIPTION,
          call_to_action: {
            type: 'LEARN_MORE',
            value: {
              link: WEBSITE_URL,
            },
          },
          ...(thumbnailUrl ? { image_url: thumbnailUrl } : {}),
        },
      },
      url_tags: URL_TAGS,
    };

    const creativeResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adcreatives`, creativeBody, token);

    if (creativeResult['error']) {
      console.log(` ❌`);
      console.log(`   Erro criativo: ${JSON.stringify(creativeResult['error'])}`);
      failed++;
      continue;
    }

    const creativeId = creativeResult['id'] as string;
    console.log(` ✅ (${creativeId})`);

    // 3. Create Ad
    process.stdout.write('   Criando anúncio...');
    const adBody = {
      adset_id: adSetId,
      name: title,
      status: 'ACTIVE',
      creative: { creative_id: creativeId },
    };

    const adResult = await apiPost(`${BASE_URL}/act_${AD_ACCOUNT_ID}/ads`, adBody, token);

    if (adResult['error']) {
      console.log(` ❌`);
      console.log(`   Erro anúncio: ${JSON.stringify(adResult['error'])}`);
      failed++;
      continue;
    }

    const adId = adResult['id'] as string;
    console.log(` ✅ (${adId})`);
    success++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Resultado:`);
  console.log(`   ✅ Anúncios criados com sucesso: ${success}/13`);
  if (failed > 0) console.log(`   ❌ Falhas: ${failed}`);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
