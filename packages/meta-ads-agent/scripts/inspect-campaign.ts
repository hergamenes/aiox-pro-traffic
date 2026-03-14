import { getAccessToken } from '../src/auth/token-manager.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const AD_ACCOUNT_ID = '416838927672559';
const CAMPAIGN_NAME = 'VK_CA00_LMT_LEADS_CADASTRO_NR1-6_MAR-26_FRIO_LIVE-QUARTA_LEVA-09.03_AD01';

async function main() {
  const token = await getAccessToken();

  // 1. Find campaign
  console.log('📋 Buscando campanha...');
  let campaignId = '';
  let url: string | null = `${BASE_URL}/act_${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,daily_budget,objective,buying_type,special_ad_categories,bid_strategy&limit=500&access_token=${token}`;

  while (url) {
    const res = await fetch(url);
    const json = (await res.json()) as Record<string, unknown>;
    const data = json['data'] as Array<Record<string, unknown>> | undefined;
    if (data) {
      const found = data.find(c => c['name'] === CAMPAIGN_NAME);
      if (found) {
        campaignId = found['id'] as string;
        console.log('\n✅ Campanha encontrada:');
        console.log(JSON.stringify(found, null, 2));
        break;
      }
    }
    const paging = json['paging'] as Record<string, unknown> | undefined;
    url = (paging?.['next'] as string) ?? null;
  }

  if (!campaignId) {
    console.error('❌ Campanha não encontrada!');
    process.exit(1);
  }

  // 2. Get existing ad sets
  console.log('\n📋 Buscando ad sets existentes...');
  const adSetsUrl = `${BASE_URL}/${campaignId}/adsets?fields=id,name,status,daily_budget,lifetime_budget,billing_event,optimization_goal,bid_strategy,targeting,promoted_object,start_time,end_time,destination_type&limit=100&access_token=${token}`;
  const adSetsRes = await fetch(adSetsUrl);
  const adSetsJson = (await adSetsRes.json()) as Record<string, unknown>;
  const adSets = adSetsJson['data'] as Array<Record<string, unknown>> | undefined;

  if (adSets && adSets.length > 0) {
    console.log(`\n✅ ${adSets.length} ad set(s) encontrado(s):`);
    for (const adSet of adSets) {
      console.log('\n--- Ad Set ---');
      console.log(JSON.stringify(adSet, null, 2));
    }
  } else {
    console.log('⚠️  Nenhum ad set encontrado');
  }

  // 3. Get existing ads (to see creative format)
  if (adSets && adSets.length > 0) {
    const firstAdSetId = adSets[0]['id'] as string;
    console.log('\n📋 Buscando anúncios do primeiro ad set...');
    const adsUrl = `${BASE_URL}/${firstAdSetId}/ads?fields=id,name,status,creative{id,name,object_story_spec,asset_feed_spec,url_tags}&limit=10&access_token=${token}`;
    const adsRes = await fetch(adsUrl);
    const adsJson = (await adsRes.json()) as Record<string, unknown>;
    const ads = adsJson['data'] as Array<Record<string, unknown>> | undefined;

    if (ads && ads.length > 0) {
      console.log(`\n✅ ${ads.length} anúncio(s) encontrado(s):`);
      for (const ad of ads) {
        console.log('\n--- Anúncio ---');
        console.log(JSON.stringify(ad, null, 2));
      }
    }
  }

  // 4. Search for videos in media library
  console.log('\n📋 Buscando vídeos na biblioteca de mídia...');
  const videosUrl = `${BASE_URL}/act_${AD_ACCOUNT_ID}/advideos?fields=id,title,created_time,status&limit=100&filtering=[{"field":"title","operator":"CONTAIN","value":"FELIPE - REELS - 13 FATORES - AULA DE QUARTA"}]&access_token=${token}`;
  const videosRes = await fetch(videosUrl);
  const videosJson = (await videosRes.json()) as Record<string, unknown>;
  const videos = videosJson['data'] as Array<Record<string, unknown>> | undefined;

  if (videos && videos.length > 0) {
    console.log(`\n✅ ${videos.length} vídeo(s) encontrado(s):`);
    for (const v of videos) {
      console.log(`   ${v['title']} → ID: ${v['id']}`);
    }
  } else {
    console.log('⚠️  Nenhum vídeo encontrado com esse filtro');
    // Try without filter
    console.log('\n📋 Buscando todos os vídeos recentes...');
    const allVideosUrl = `${BASE_URL}/act_${AD_ACCOUNT_ID}/advideos?fields=id,title,created_time&limit=50&sort=created_time_descending&access_token=${token}`;
    const allVidsRes = await fetch(allVideosUrl);
    const allVidsJson = (await allVidsRes.json()) as Record<string, unknown>;
    const allVids = allVidsJson['data'] as Array<Record<string, unknown>> | undefined;
    if (allVids) {
      const matching = allVids.filter(v => ((v['title'] as string) || '').includes('FATORES'));
      console.log(`   Vídeos com "FATORES" no título: ${matching.length}`);
      matching.forEach(v => console.log(`   ${v['title']} → ID: ${v['id']}`));
    }
  }

  // 5. Search for custom audiences to exclude
  console.log('\n📋 Buscando públicos personalizados para exclusão...');
  const audiencesUrl = `${BASE_URL}/act_${AD_ACCOUNT_ID}/customaudiences?fields=id,name,subtype,approximate_count&limit=200&access_token=${token}`;
  const audiencesRes = await fetch(audiencesUrl);
  const audiencesJson = (await audiencesRes.json()) as Record<string, unknown>;
  const audiences = audiencesJson['data'] as Array<Record<string, unknown>> | undefined;

  if (audiences) {
    const leadAud = audiences.filter(a => ((a['name'] as string) || '').includes('Lead'));
    const compraAud = audiences.filter(a => ((a['name'] as string) || '').includes('Compra'));
    console.log(`\n   Públicos com "Lead": ${leadAud.length}`);
    leadAud.forEach(a => console.log(`   - ${a['name']} (ID: ${a['id']}, ~${a['approximate_count']})`));
    console.log(`\n   Públicos com "Compra": ${compraAud.length}`);
    compraAud.forEach(a => console.log(`   - ${a['name']} (ID: ${a['id']}, ~${a['approximate_count']})`));
  }

  // 6. Get Instagram account ID
  console.log('\n📋 Buscando conta Instagram...');
  const pageId = '1646687212287892';
  const igUrl = `${BASE_URL}/${pageId}?fields=instagram_business_account{id,name,username}&access_token=${token}`;
  const igRes = await fetch(igUrl);
  const igJson = (await igRes.json()) as Record<string, unknown>;
  const igAccount = igJson['instagram_business_account'] as Record<string, unknown> | undefined;
  if (igAccount) {
    console.log(`   Instagram: @${igAccount['username']} → ID: ${igAccount['id']}`);
  }
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
