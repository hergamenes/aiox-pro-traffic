#!/bin/bash
# Script para adicionar Instagram psicologofelipemaronesi a todos os anúncios KIT-NR-1_MAR-26
# Instagram Account ID: 17841403089717017

TOKEN=$(security find-generic-password -s "meta-ads-agent" -a "access-token" -w 2>/dev/null)
AD_ACCOUNT="918259969607753"
IG_ID="17841403089717017"
API_VERSION="v21.0"
BASE_URL="https://graph.facebook.com/${API_VERSION}"
DELAY=8  # seconds between campaigns to avoid rate limiting

# Correct campaign IDs (from API query, matching KIT-NR-1_MAR-26)
CAMPAIGN_IDS=(
  120245858617090699
  120245858619940699
  120245858622620699
  120245858629790699
  120245858633040699
  120245858637180699
  120245858643060699
  120245858649250699
  120245858652580699
  120245858656760699
  120245858661030699
  120245858663850699
  120245858667840699
  120245858719160699
  120245858722290699
  120245858727650699
  120245858732240699
  120245858735290699
  120245858739560699
  120245858744340699
  120245858749130699
  120245858752700699
)

SUCCESS=0
FAIL=0
SKIP=0
TOTAL=${#CAMPAIGN_IDS[@]}

echo "================================================"
echo "Adicionando Instagram (ID: $IG_ID) a $TOTAL campanhas"
echo "Delay entre chamadas: ${DELAY}s"
echo "================================================"
echo ""

for i in "${!CAMPAIGN_IDS[@]}"; do
  CAMP_ID=${CAMPAIGN_IDS[$i]}
  N=$((i + 1))
  echo "[$N/$TOTAL] Campanha $CAMP_ID..."

  # Step 1: Get ad sets for this campaign
  sleep 2
  ADSETS_JSON=$(curl -s "${BASE_URL}/${CAMP_ID}/adsets?fields=id&access_token=${TOKEN}" 2>/dev/null)
  ADSET_ID=$(echo "$ADSETS_JSON" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    data = d.get('data', [])
    if data:
        print(data[0]['id'])
except: pass
" 2>/dev/null)

  if [ -z "$ADSET_ID" ]; then
    echo "  ❌ Sem ad set"
    FAIL=$((FAIL + 1))
    sleep $DELAY
    continue
  fi
  echo "  Ad Set: $ADSET_ID"

  # Step 2: Get ads for this ad set (with creative details)
  sleep 3
  ADS_JSON=$(curl -s "${BASE_URL}/${ADSET_ID}/ads?fields=id,name,creative{id,object_story_spec,url_tags}&access_token=${TOKEN}" 2>/dev/null)

  # Parse ad ID and creative
  PARSED=$(echo "$ADS_JSON" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    data = d.get('data', [])
    if not data:
        print('ERROR:no_ads')
        sys.exit()
    ad = data[0]
    ad_id = ad['id']
    creative = ad.get('creative', {})
    creative_id = creative.get('id', '')
    spec = creative.get('object_story_spec', {})
    url_tags = creative.get('url_tags', '')

    # Check if instagram_actor_id already set
    if spec.get('instagram_actor_id'):
        print(f'SKIP:{ad_id}:already_has_ig')
        sys.exit()

    print(f'OK:{ad_id}:{creative_id}')
    # Output spec and url_tags as JSON on second line
    print(json.dumps({'spec': spec, 'url_tags': url_tags}))
except Exception as e:
    print(f'ERROR:{e}')
" 2>/dev/null)

  FIRST_LINE=$(echo "$PARSED" | head -1)
  STATUS=$(echo "$FIRST_LINE" | cut -d: -f1)

  if [ "$STATUS" = "ERROR" ]; then
    echo "  ❌ $FIRST_LINE"
    FAIL=$((FAIL + 1))
    sleep $DELAY
    continue
  fi

  if [ "$STATUS" = "SKIP" ]; then
    echo "  ⏭️ Instagram já configurado"
    SKIP=$((SKIP + 1))
    sleep 3
    continue
  fi

  AD_ID=$(echo "$FIRST_LINE" | cut -d: -f2)
  CREATIVE_ID=$(echo "$FIRST_LINE" | cut -d: -f3)
  SPEC_JSON=$(echo "$PARSED" | tail -1)
  echo "  Ad: $AD_ID, Creative: $CREATIVE_ID"

  # Step 3: Create new creative with instagram_actor_id added
  sleep 3
  NEW_CREATIVE_BODY=$(echo "$SPEC_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
spec = data['spec']
spec['instagram_actor_id'] = '${IG_ID}'
body = {
    'access_token': '${TOKEN}',
    'object_story_spec': json.dumps(spec)
}
url_tags = data.get('url_tags', '')
if url_tags:
    body['url_tags'] = url_tags
# Output as URL-encoded form data for curl
parts = []
for k, v in body.items():
    parts.append(f'{k}={v}')
print('&'.join(parts))
" 2>/dev/null)

  CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/act_${AD_ACCOUNT}/adcreatives" \
    --data-urlencode "access_token=${TOKEN}" \
    --data-urlencode "object_story_spec=$(echo "$SPEC_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
spec = data['spec']
spec['instagram_actor_id'] = '${IG_ID}'
print(json.dumps(spec))
")" \
    $(echo "$SPEC_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
url_tags = data.get('url_tags', '')
if url_tags:
    print(f'--data-urlencode url_tags={url_tags}')
" 2>/dev/null) 2>/dev/null)

  NEW_CREATIVE_ID=$(echo "$CREATE_RESPONSE" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    cid = d.get('id', '')
    if cid:
        print(cid)
    else:
        err = d.get('error', {}).get('message', 'unknown')
        print(f'ERROR:{err}')
except Exception as e:
    print(f'ERROR:{e}')
" 2>/dev/null)

  if [[ "$NEW_CREATIVE_ID" == ERROR:* ]]; then
    echo "  ❌ Criar creative falhou: $NEW_CREATIVE_ID"
    echo "  Response: $(echo "$CREATE_RESPONSE" | head -c 200)"
    FAIL=$((FAIL + 1))
    sleep $DELAY
    continue
  fi
  echo "  Novo Creative: $NEW_CREATIVE_ID"

  # Step 4: Update ad to use new creative
  sleep 3
  UPDATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/${AD_ID}" \
    --data-urlencode "access_token=${TOKEN}" \
    --data-urlencode "creative={\"creative_id\":\"${NEW_CREATIVE_ID}\"}" 2>/dev/null)

  UPDATE_SUCCESS=$(echo "$UPDATE_RESPONSE" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print('OK' if d.get('success') else f'FAIL:{d.get(\"error\",{}).get(\"message\",\"unknown\")}')
except: print('FAIL:parse_error')
" 2>/dev/null)

  if [ "$UPDATE_SUCCESS" = "OK" ]; then
    echo "  ✅ Instagram adicionado!"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  ❌ Update falhou: $UPDATE_SUCCESS"
    FAIL=$((FAIL + 1))
  fi

  if [ $N -lt $TOTAL ]; then
    echo "  Aguardando ${DELAY}s..."
    sleep $DELAY
  fi
  echo ""
done

echo "================================================"
echo "RESULTADO FINAL"
echo "  ✅ Sucesso: $SUCCESS/$TOTAL"
echo "  ⏭️ Já tinha IG: $SKIP/$TOTAL"
echo "  ❌ Falha: $FAIL/$TOTAL"
echo "================================================"
