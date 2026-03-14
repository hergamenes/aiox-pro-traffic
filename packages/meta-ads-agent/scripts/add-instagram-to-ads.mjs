// Script para adicionar Instagram psicologofelipemaronesi a todos os anúncios KIT-NR-1_MAR-26
// Instagram Account ID: 17841403089717017

import { execSync } from 'node:child_process';

const TOKEN = execSync('security find-generic-password -s "meta-ads-agent" -a "access-token" -w', { encoding: 'utf8' }).trim();
const AD_ACCOUNT = '918259969607753';
const IG_ID = '17841403089717017';
const API_VERSION = 'v21.0';
const BASE = `https://graph.facebook.com/${API_VERSION}`;
const DELAY = 6000; // ms between campaigns

const CAMPAIGN_IDS = [
  '120245858617090699', '120245858619940699', '120245858622620699',
  '120245858629790699', '120245858633040699', '120245858637180699',
  '120245858643060699', '120245858649250699', '120245858652580699',
  '120245858656760699', '120245858661030699', '120245858663850699',
  '120245858667840699', '120245858719160699', '120245858722290699',
  '120245858727650699', '120245858732240699', '120245858735290699',
  '120245858739560699', '120245858744340699', '120245858749130699',
  '120245858752700699',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function apiGet(path) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${BASE}/${path}${sep}access_token=${TOKEN}`;
  const res = await fetch(url);
  return res.json();
}

async function apiPost(path, body) {
  const url = `${BASE}/${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: TOKEN }),
  });
  return res.json();
}

let success = 0;
let fail = 0;
let skip = 0;

console.log('================================================');
console.log(`Adicionando Instagram (ID: ${IG_ID}) a ${CAMPAIGN_IDS.length} campanhas`);
console.log('================================================\n');

for (let i = 0; i < CAMPAIGN_IDS.length; i++) {
  const campId = CAMPAIGN_IDS[i];
  const n = i + 1;
  console.log(`[${n}/${CAMPAIGN_IDS.length}] Campanha ${campId}...`);

  try {
    // Step 1: Get ads for this campaign (via ad account filtering)
    const adsRes = await apiGet(`act_${AD_ACCOUNT}/ads?filtering=[{"field":"campaign.id","operator":"EQUAL","value":"${campId}"}]&fields=id,name,creative{id,object_story_spec,url_tags}`);

    if (adsRes.error) {
      console.log(`  ❌ Erro ao buscar ads: ${adsRes.error.message}`);
      fail++;
      await sleep(DELAY);
      continue;
    }

    const ads = adsRes.data || [];
    if (ads.length === 0) {
      console.log(`  ❌ Nenhum ad encontrado`);
      fail++;
      await sleep(DELAY);
      continue;
    }

    const ad = ads[0];
    const adId = ad.id;
    const adName = ad.name;
    const creative = ad.creative;

    if (!creative || !creative.object_story_spec) {
      console.log(`  Ad: ${adId} (${adName})`);
      console.log(`  ❌ Sem object_story_spec no creative`);
      // Try fetching creative directly
      if (creative?.id) {
        console.log(`  Tentando buscar creative ${creative.id} diretamente...`);
        await sleep(2000);
        const creativeRes = await apiGet(`${creative.id}?fields=object_story_spec,url_tags`);
        if (creativeRes.error || !creativeRes.object_story_spec) {
          console.log(`  ❌ Creative sem object_story_spec: ${JSON.stringify(creativeRes.error || 'no spec')}`);
          fail++;
          await sleep(DELAY);
          continue;
        }
        // Use this spec
        creative.object_story_spec = creativeRes.object_story_spec;
        creative.url_tags = creativeRes.url_tags;
      } else {
        fail++;
        await sleep(DELAY);
        continue;
      }
    }

    const spec = creative.object_story_spec;
    console.log(`  Ad: ${adId} (${adName}), Creative: ${creative.id}`);

    // Check if Instagram already set
    if (spec.instagram_actor_id) {
      console.log(`  ⏭️ Instagram já configurado (${spec.instagram_actor_id})`);
      skip++;
      await sleep(3000);
      continue;
    }

    // Step 2: Create new creative with instagram_actor_id
    await sleep(2000);
    const newSpec = { ...spec, instagram_actor_id: IG_ID };
    const createBody = {
      object_story_spec: newSpec,
    };
    if (creative.url_tags) {
      createBody.url_tags = creative.url_tags;
    }

    const createRes = await apiPost(`act_${AD_ACCOUNT}/adcreatives`, createBody);
    if (createRes.error) {
      console.log(`  ❌ Criar creative falhou: ${createRes.error.message}`);
      fail++;
      await sleep(DELAY);
      continue;
    }

    const newCreativeId = createRes.id;
    console.log(`  Novo Creative: ${newCreativeId}`);

    // Step 3: Update ad to use new creative
    await sleep(2000);
    const updateRes = await apiPost(adId, {
      creative: { creative_id: newCreativeId },
    });

    if (updateRes.success) {
      console.log(`  ✅ Instagram adicionado!`);
      success++;
    } else {
      console.log(`  ❌ Update falhou: ${JSON.stringify(updateRes.error || updateRes)}`);
      fail++;
    }
  } catch (err) {
    console.log(`  ❌ Exceção: ${err.message}`);
    fail++;
  }

  if (i < CAMPAIGN_IDS.length - 1) {
    await sleep(DELAY);
  }
  console.log('');
}

console.log('================================================');
console.log('RESULTADO FINAL');
console.log(`  ✅ Sucesso: ${success}/${CAMPAIGN_IDS.length}`);
console.log(`  ⏭️ Já tinha IG: ${skip}/${CAMPAIGN_IDS.length}`);
console.log(`  ❌ Falha: ${fail}/${CAMPAIGN_IDS.length}`);
console.log('================================================');
