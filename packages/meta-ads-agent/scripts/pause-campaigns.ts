import { getAccessToken } from '../src/auth/token-manager.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const AD_ACCOUNT_ID = '416838927672559';
const INCREASE_PERCENT = 30;

const CAMPAIGN_NAMES = [
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_AD-TREINAMENTO_21',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_AD-CAIXINHA_15',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_AD-CAIXINHA_04',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_LP-6BX6C_AD-TREINAMENTO_07',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_LP-6BX6C_AD-TREINAMENTO_12',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_AD546',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_FEV-26_F_ADV_1-1-1_TESTE-LPS_NATIVO_IMG_VERSAO-2_AD03',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_LP-6BX6C_AD-TREINAMENTO_19',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_LP-6BX6C_AD-TREINAMENTO_04',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_AD-TREINAMENTO_12',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_AD-TREINAMENTO_05',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_JAN-26_QUENTE_1-1-2_LP-6_RMKT',
  'VK_CA00_LMT_VENDAS_COMPRA_NR1-6_MAR-26_F_ADV_1-1-1_AD-TREINAMENTO_22',
];

const nameSet = new Set(CAMPAIGN_NAMES);

interface Campaign {
  id: string;
  name: string;
  status: string;
  daily_budget?: string;
  lifetime_budget?: string;
}

async function fetchAllCampaigns(token: string): Promise<Campaign[]> {
  const campaigns: Campaign[] = [];
  let url: string | null = `${BASE_URL}/act_${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,daily_budget,lifetime_budget&limit=500&access_token=${token}`;

  while (url) {
    const response = await fetch(url);
    const json = (await response.json()) as Record<string, unknown>;

    if (json['error']) {
      console.error('Erro ao buscar campanhas:', JSON.stringify(json['error'], null, 2));
      process.exit(1);
    }

    const data = json['data'] as Campaign[] | undefined;
    if (data) campaigns.push(...data);

    const paging = json['paging'] as Record<string, unknown> | undefined;
    url = (paging?.['next'] as string) ?? null;
  }

  return campaigns;
}

async function updateCampaignBudget(token: string, campaignId: string, newBudget: number): Promise<boolean> {
  const url = `${BASE_URL}/${campaignId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ daily_budget: Math.round(newBudget).toString(), access_token: token }),
  });
  const json = (await response.json()) as Record<string, unknown>;

  if (json['error']) {
    console.error(`  ❌ Erro: ${JSON.stringify(json['error'])}`);
    return false;
  }
  return true;
}

function formatBRL(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2)}`;
}

async function main() {
  console.log('🔑 Obtendo token de acesso...');
  const token = await getAccessToken();
  console.log('✅ Token obtido\n');

  console.log(`📋 Buscando campanhas da conta ${AD_ACCOUNT_ID}...`);
  const allCampaigns = await fetchAllCampaigns(token);
  console.log(`   Total de campanhas na conta: ${allCampaigns.length}\n`);

  const targetCampaigns = allCampaigns.filter(c => nameSet.has(c.name));
  const notFound = CAMPAIGN_NAMES.filter(name => !allCampaigns.some(c => c.name === name));

  console.log(`🎯 Campanhas encontradas: ${targetCampaigns.length}/${CAMPAIGN_NAMES.length}`);

  if (notFound.length > 0) {
    console.log(`\n⚠️  Campanhas NÃO encontradas (${notFound.length}):`);
    notFound.forEach(name => console.log(`   - ${name}`));
  }

  console.log(`\n💰 Aumentando orçamento diário em ${INCREASE_PERCENT}% (CBO - nível da campanha)...\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (const campaign of targetCampaigns) {
    const currentBudget = parseInt(campaign.daily_budget || '0', 10);
    const lifetimeBudget = parseInt(campaign.lifetime_budget || '0', 10);

    if (currentBudget === 0 && lifetimeBudget > 0) {
      console.log(`📌 ${campaign.name}`);
      console.log(`   ⚠️  Usa lifetime budget (${formatBRL(lifetimeBudget)}), não daily budget — ignorada\n`);
      skippedCount++;
      continue;
    }

    if (currentBudget === 0) {
      console.log(`📌 ${campaign.name}`);
      console.log(`   ⚠️  Sem orçamento definido na campanha — ignorada\n`);
      skippedCount++;
      continue;
    }

    const newBudget = Math.round(currentBudget * (1 + INCREASE_PERCENT / 100));

    process.stdout.write(`📌 ${campaign.name}: ${formatBRL(currentBudget)} → ${formatBRL(newBudget)} (+${INCREASE_PERCENT}%)...`);

    const ok = await updateCampaignBudget(token, campaign.id, newBudget);
    if (ok) {
      console.log(' ✅');
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ Campanhas atualizadas: ${successCount}`);
  if (failCount > 0) console.log(`   ❌ Falhas: ${failCount}`);
  if (skippedCount > 0) console.log(`   ⚠️  Ignoradas (sem daily budget): ${skippedCount}`);
  if (notFound.length > 0) console.log(`   🔍 Não encontradas: ${notFound.length}`);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
