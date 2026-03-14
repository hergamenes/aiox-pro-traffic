import { getAccessToken } from '../src/auth/token-manager.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const AD_ACCOUNT_ID = '416838927672559';

async function main() {
  const token = await getAccessToken();
  console.log('📋 Buscando vídeos "VBLAB" + "REELS"...\n');

  const matched: Array<Record<string, unknown>> = [];
  let url: string | null = `${BASE_URL}/act_${AD_ACCOUNT_ID}/advideos?fields=id,title,created_time&limit=200&access_token=${token}`;
  let pages = 0;

  while (url && pages < 20) {
    const res = await fetch(url);
    const json = (await res.json()) as Record<string, unknown>;
    if (json['error']) { console.error('Erro:', JSON.stringify(json['error'])); break; }
    const data = json['data'] as Array<Record<string, unknown>> | undefined;
    if (data) {
      for (const v of data) {
        const title = ((v['title'] as string) || '').toLowerCase();
        if (title.includes('vblab') && title.includes('reels')) {
          matched.push(v);
        }
      }
    }
    pages++;
    const paging = json['paging'] as Record<string, unknown> | undefined;
    url = (paging?.['next'] as string) ?? null;
    if (pages % 5 === 0) console.log(`   ... ${pages * 200} vídeos verificados`);
  }

  console.log(`\n✅ Encontrados ${matched.length} vídeos:\n`);
  matched.sort((a, b) => ((a['title'] as string) || '').localeCompare((b['title'] as string) || ''));
  for (const v of matched) {
    console.log(`   "${v['title']}" → ID: ${v['id']}`);
  }
}

main().catch(err => { console.error('Erro fatal:', err); process.exit(1); });
