#!/usr/bin/env bash
# =============================================================================
# Download Stefan Georgi Swipe Files from Google Drive (rate-limit safe)
# Source: https://drive.google.com/drive/folders/125ukhHDuUCja1TZiZXjHfstxoyKT-bLc
# Strategy: Download one subfolder at a time with delay between each
# =============================================================================

set -eo pipefail

DEST_DIR="$(cd "$(dirname "$0")/.." && pwd)/data/swipe-files"
GDOWN="$(which gdown)"
LOG="$DEST_DIR/download.log"
DELAY=20  # seconds between folder downloads

mkdir -p "$DEST_DIR/copy-resources-and-swipes"
mkdir -p "$DEST_DIR/copy-resources-and-swipes-1"

# All subfolder IDs from "Copy Resources and Swipes" (folder 1)
# Bash 3.2 compatible — parallel arrays
FOLDERS_1_NAMES=()
FOLDERS_1_IDS=()

FOLDERS_1_NAMES+=("4 Minute Hypergrowth Trick"); FOLDERS_1_IDS+=("1pjlcM6OQZvoH_5XnqVQJ4XKPkA_PlHYF")
FOLDERS_1_NAMES+=("Affiliate Manager Job Posting Swipe"); FOLDERS_1_IDS+=("1RxCGmPSbyYNcH5jSzT411-k3mN4Y5n6E")
FOLDERS_1_NAMES+=("Angel Investor Summit"); FOLDERS_1_IDS+=("1ZRlWN6Hkkk4DpLKCZUfKD19D11nDwCwl")
FOLDERS_1_NAMES+=("Arthrozene"); FOLDERS_1_IDS+=("1zUixxGOlNN5GOw3sP4fWmFfd-g4-tAY1")
FOLDERS_1_NAMES+=("Backyard Liberty"); FOLDERS_1_IDS+=("1oAM5ksD5SNDBjK-6zXIsI5PkDOq_eHx4")
FOLDERS_1_NAMES+=("Beauty Food Bible"); FOLDERS_1_IDS+=("1LZLtRNYVMxGl2rzO-gbhVW6Es7vBN_DB")
FOLDERS_1_NAMES+=("Beverly Hills MD"); FOLDERS_1_IDS+=("13EHuFtn_nWOAa0hZ1E9ZpFAcW8Khipfm")
FOLDERS_1_NAMES+=("Boardroom Swipe File"); FOLDERS_1_IDS+=("10OFH-oSXYdpOJWNoHu6cKbDsXTvpERCM")
FOLDERS_1_NAMES+=("Boston Brain Science"); FOLDERS_1_IDS+=("1tcJoqP20aPHhvoGyTkhdUZdIKF4MjPwf")
FOLDERS_1_NAMES+=("Brownstone Research"); FOLDERS_1_IDS+=("1CLvpC1FC1wt28RcltzSpUtTLVYiTaeWI")
FOLDERS_1_NAMES+=("Burn Sales Letter"); FOLDERS_1_IDS+=("11sAmeEx4_DzMknzWanVyuKQbUjjmOBnw")
FOLDERS_1_NAMES+=("Cannabis Lots"); FOLDERS_1_IDS+=("1mSYnsvz9KdpBiOnMSmCuye1uPZ_bfpxl")
FOLDERS_1_NAMES+=("Chad is Coming for Your Lifeblood"); FOLDERS_1_IDS+=("1zCk5YS-vebxBOVFuZ0WPTvpBjv_JAtTx")
FOLDERS_1_NAMES+=("City Beauty"); FOLDERS_1_IDS+=("1REYrc2jeEUi8Rn6rv4yn6MPH7cT8rj8m")
FOLDERS_1_NAMES+=("City Beauty VSL - 2"); FOLDERS_1_IDS+=("1Kpd7OxCD1DlwxlKlQlMrrW51K5LlubrU")
FOLDERS_1_NAMES+=("Daniel Levis"); FOLDERS_1_IDS+=("1Lt-mKQfgjUX4v0osNqDV_ndSTMe2mkbp")
FOLDERS_1_NAMES+=("Dean Graziosi Free Book Funnel"); FOLDERS_1_IDS+=("1MlSNiKwja-t06BspAa0UalgiepA2S364")
FOLDERS_1_NAMES+=("Digestion Defense"); FOLDERS_1_IDS+=("17cXVXhfrqzyoxmzYjCk_N1JQehX3YdTw")
FOLDERS_1_NAMES+=("Dr. Al Sears"); FOLDERS_1_IDS+=("1ioRcFekRb8hTOfSrEeJKwo3wwc-PEBsM")
FOLDERS_1_NAMES+=("Dr. Gundry - Bio Complete 3"); FOLDERS_1_IDS+=("1KqR3zWCziQH7zvLnpsO7LOZfpPxW3hqR")
FOLDERS_1_NAMES+=("Eds Supplement Intensive Sales Letter"); FOLDERS_1_IDS+=("1khHtCy00Ws71fuM__Yv7S9fJ5DtwlA2P")
FOLDERS_1_NAMES+=("Email Swipes"); FOLDERS_1_IDS+=("1Bng1GCsrLT661Lc2eOyWajOpMh6ZN9FD")
FOLDERS_1_NAMES+=("Emo Letter Examples"); FOLDERS_1_IDS+=("1kC1-DylS0EqB6l450XRXv0yy_QrUjMLs")
FOLDERS_1_NAMES+=("Eugene Schwartz"); FOLDERS_1_IDS+=("1y1HHuo-fvip-mOAVeTmTgIU3t1aK5TaU")
FOLDERS_1_NAMES+=("Fascinations"); FOLDERS_1_IDS+=("1X9PP6BYKcp4IY1gKqz26yTuHDxg34mQ5")
FOLDERS_1_NAMES+=("Flat Belly Fix"); FOLDERS_1_IDS+=("1fgKtilhNASfm2Si3RdKIGckkWxA64PM0")
FOLDERS_1_NAMES+=("Funnel Building"); FOLDERS_1_IDS+=("1SytTV8A35ZLuYcFV7SxsprXNwKW12fjE")
FOLDERS_1_NAMES+=("General Copywriting"); FOLDERS_1_IDS+=("1rlhGB_2CLHQKZGzvAZzoL9aPSZYW8R4i")
FOLDERS_1_NAMES+=("Golden Hippo Transcripts"); FOLDERS_1_IDS+=("1IGyMsU43ioKYWmj05fbtS51ozqjHkOhc")
FOLDERS_1_NAMES+=("Gutcleanse Protocol"); FOLDERS_1_IDS+=("1kou0DxKhpQF-n9SWgmo1nmamxm5hDB4C")
FOLDERS_1_NAMES+=("Halbert"); FOLDERS_1_IDS+=("1IeGo_RSRDyV045GCtQKKQ-TiOrFPlKAI")
FOLDERS_1_NAMES+=("Hard to Find Ads - Advertorial Collection"); FOLDERS_1_IDS+=("1C4SduiR8ArdTVH7QyZddtuRjUIESxPHs")
FOLDERS_1_NAMES+=("Headlines"); FOLDERS_1_IDS+=("1hbfMg3ZKAA5DnaI5IUW5CLuN6VzIlaGf")
FOLDERS_1_NAMES+=("How Dr. Axe Killed It With Webinars"); FOLDERS_1_IDS+=("1hIa3fPMnRh8WZ6A8UU3h3C-J0brahT1Y")
FOLDERS_1_NAMES+=("Inner Skin Research"); FOLDERS_1_IDS+=("1Cdyu-Rqn8K6f0LQbrH0VpwDosKDTWp9k")
FOLDERS_1_NAMES+=("John Benson"); FOLDERS_1_IDS+=("16WtHRy5UXQ20l1yu5MxLYT0kuPx0vMyS")
FOLDERS_1_NAMES+=("John Carlton"); FOLDERS_1_IDS+=("16oCIRwE0_UsPhlcqFNE_uwRnF1Dx2YSD")
FOLDERS_1_NAMES+=("Justin Goff Interviews With CA Members"); FOLDERS_1_IDS+=("1CHjPu1kxdnj70B1LPONJD3f6XmILMpJn")
FOLDERS_1_NAMES+=("Keto Book Funnels"); FOLDERS_1_IDS+=("1Gp16qlfhIwMMLSFQPp9jwffncflocWLU")
FOLDERS_1_NAMES+=("Keto Funnels With Upsells Examples"); FOLDERS_1_IDS+=("1yfP8WtUq585CHX2_Jnu8_QWPwsbt4EMa")
FOLDERS_1_NAMES+=("Liver Toxins"); FOLDERS_1_IDS+=("1LFdIf2clwCFVOXOzdcH-5S2tisF4ekVw")
FOLDERS_1_NAMES+=("Male Enhancement Swipes"); FOLDERS_1_IDS+=("1HTTJKqOX3nLBo_K-flYk8naXmDc-S_V0")
FOLDERS_1_NAMES+=("Massive Agora Swipe File"); FOLDERS_1_IDS+=("14eRonZKHYWjqhylXeVsedgGtgQ_zebq_")
FOLDERS_1_NAMES+=("Michael Fiore"); FOLDERS_1_IDS+=("1IOIdA9SB52a-DiYR8nlD7eRY3ZWFjkaW")
FOLDERS_1_NAMES+=("Mike Morgan"); FOLDERS_1_IDS+=("1IE3DCTLLidgcO-QasffTsL_BnHFPaV7-")
FOLDERS_1_NAMES+=("Military Hero Meditation"); FOLDERS_1_IDS+=("1a2AF3_WOJjPUFgUCLcy9sRoXtDH5t8KZ")
FOLDERS_1_NAMES+=("Mini Sales Letter Scripts"); FOLDERS_1_IDS+=("1x_NMoTZfBjaeAuIVYjiL9qCJoKspquL-")
FOLDERS_1_NAMES+=("Miracle Cure"); FOLDERS_1_IDS+=("1FVTOnQ4OFgX_1E9a1qStDrPjv3m9h28j")
FOLDERS_1_NAMES+=("My Funnel Freedom"); FOLDERS_1_IDS+=("1t215HBbXvrYm4N4mIupJuQp-de0dgyml")
FOLDERS_1_NAMES+=("Native Path Keto Funnel"); FOLDERS_1_IDS+=("1J19ZplNGKAQE0Oi2ituV9m6xTwoP1-xx")
FOLDERS_1_NAMES+=("NSFW - Dating Sex Etc"); FOLDERS_1_IDS+=("1bNeGdAC0XBAojs8wib3lWzBg62kUbcgN")
FOLDERS_1_NAMES+=("On Persuasion"); FOLDERS_1_IDS+=("1YqnwB5CXNaB9N7t9_B2_Sua74WZLjg6Y")
FOLDERS_1_NAMES+=("Original Venus Factor"); FOLDERS_1_IDS+=("1fYPMIIuh8zzp3JhyMDYeJsDIcybmebPj")
FOLDERS_1_NAMES+=("Others Resources for Me"); FOLDERS_1_IDS+=("16pUaZy1pX5uQe3xE4lAgSAybfgIwIuj2")
FOLDERS_1_NAMES+=("Oxford Club OReilly Transcript"); FOLDERS_1_IDS+=("1SwNhXzVa6MgX8e7T4bWODfX6t3Nh0ZgS")
FOLDERS_1_NAMES+=("Palm Beach Group"); FOLDERS_1_IDS+=("148EHoDp8amQNp93DsGcpgMT_0NKgo59Z")
FOLDERS_1_NAMES+=("Parris Lampropoulous Swipes"); FOLDERS_1_IDS+=("1c9Em_FiIY8UpUbzRi22AyV7epgfutj2l")
FOLDERS_1_NAMES+=("Phone Closers - Chris Taylor"); FOLDERS_1_IDS+=("17D7wYyMRVIdSsFqUb0KOJ7gIkuSiZGfD")
FOLDERS_1_NAMES+=("Pimsleur Approach Transcript"); FOLDERS_1_IDS+=("1DdNwzOXXueWaHa2MH--BNWyADoFN7NFc")
FOLDERS_1_NAMES+=("Power 4 Homes"); FOLDERS_1_IDS+=("1NARIZtKR89FA60DF5E858o-ZUYQ2Pc-e")
FOLDERS_1_NAMES+=("Pro Paradigm Press"); FOLDERS_1_IDS+=("13UPdcUDHP0z5vLc8RFlOkQn1LRmfvZBP")
FOLDERS_1_NAMES+=("Proof-Building Authority"); FOLDERS_1_IDS+=("1rf47c93893CRjeDNJZknqXHTyI82cSRW")
FOLDERS_1_NAMES+=("Quantum Growth By King Kong"); FOLDERS_1_IDS+=("19o3lspYh6hlJ68yBSKIl3HetvEo85zYa")
FOLDERS_1_NAMES+=("QVC Skincare Compliance Document"); FOLDERS_1_IDS+=("1vqf4RSG40Htb24ee49x1WwWgjfBK_nWM")
FOLDERS_1_NAMES+=("Red Tea Detox Script"); FOLDERS_1_IDS+=("1eKMI6w332dr2QMVM-0R3q24Nga-0e3WZ")
FOLDERS_1_NAMES+=("Resurge"); FOLDERS_1_IDS+=("1w6liqxA54DxL2Cf6joJoLsBN_HwuYVsH")
FOLDERS_1_NAMES+=("Salus Gut Offer"); FOLDERS_1_IDS+=("1ogKJE1l977XOog2xNFBpZi51aVui8R8h")
FOLDERS_1_NAMES+=("Sell Like Crazy - Book Trailer"); FOLDERS_1_IDS+=("1WRo8JoQ-8UKB7lo23k0Xgqi0goGLExq4")
FOLDERS_1_NAMES+=("Sell like Crazy - Upsell Sales Funnel"); FOLDERS_1_IDS+=("1C4HYmGb5xQ6ZKX4Pwiz64Tx3_vuRJhc8")
FOLDERS_1_NAMES+=("Shapiro Hair"); FOLDERS_1_IDS+=("1FtLBHkv2Lt_ztXRH2x48BJIJxl6KRh_W")
FOLDERS_1_NAMES+=("SPG Copywriter Training Post"); FOLDERS_1_IDS+=("1_Ubh3huDM-Wy9okwIW0P5qWyaON9874l")
FOLDERS_1_NAMES+=("Stem Cell Restore With Comments"); FOLDERS_1_IDS+=("1U7Mbzeih46bN9MBfjs-cQANxHsbq7Mih")
FOLDERS_1_NAMES+=("The Keto Shark Tank Lander"); FOLDERS_1_IDS+=("1zsxxumbBzhY_TWQWOSTnmec-mKBzC-uJ")
FOLDERS_1_NAMES+=("The new Gut Fix"); FOLDERS_1_IDS+=("1nnuchaM7eHVp5MGZhcT9Ra9-Yws_DU2_")
FOLDERS_1_NAMES+=("Top Clickbank Weight Loss Offers"); FOLDERS_1_IDS+=("1yxMfZFyK1pjE8djYfWLOURSMWYE8tmEP")
FOLDERS_1_NAMES+=("Topline Health Swipes"); FOLDERS_1_IDS+=("13legOoJyCyA8f9zyiPY8bboYmHVY7GDU")
FOLDERS_1_NAMES+=("United Probiotic Script"); FOLDERS_1_IDS+=("1X5IFX8vLbjvCNZ6JsheJ0cPtsZaX2cjD")
FOLDERS_1_NAMES+=("Vedda Blood Sugar"); FOLDERS_1_IDS+=("1PtNsjDlDrYYY84F6wBTVdMa4-hqZTsVo")
FOLDERS_1_NAMES+=("Worlds Greatest Treasury Boardroom"); FOLDERS_1_IDS+=("1YjNqecxGuvXlwDpCYm-AX6TI7furFC28")
FOLDERS_1_NAMES+=("Yoga Burn"); FOLDERS_1_IDS+=("1tcTirzdmvDQvFSp20QF7wvfSrts3bfzU")

# Single file in folder 1
LINKS_DOC_ID="1OMeJJFd4QWV_RtLiWr96Le2_bVV0eA4F"

# Folder 2 subfolders
# Bash 3.2 compatible — parallel arrays
FOLDERS_2_NAMES=()
FOLDERS_2_IDS=()

FOLDERS_2_NAMES+=("Boardroom Swipe File"); FOLDERS_2_IDS+=("10OFH-oSXYdpOJWNoHu6cKbDsXTvpERCM")
FOLDERS_2_NAMES+=("Compliance"); FOLDERS_2_IDS+=("UNKNOWN")
FOLDERS_2_NAMES+=("Massive Agora Swipe File"); FOLDERS_2_IDS+=("14eRonZKHYWjqhylXeVsedgGtgQ_zebq_")
FOLDERS_2_NAMES+=("Master Activator Revolution"); FOLDERS_2_IDS+=("UNKNOWN")
FOLDERS_2_NAMES+=("Others Resources for Me"); FOLDERS_2_IDS+=("16pUaZy1pX5uQe3xE4lAgSAybfgIwIuj2")
FOLDERS_2_NAMES+=("Parris Lampropoulous Swipes"); FOLDERS_2_IDS+=("1c9Em_FiIY8UpUbzRi22AyV7epgfutj2l")
FOLDERS_2_NAMES+=("Topline Health Swipes"); FOLDERS_2_IDS+=("13legOoJyCyA8f9zyiPY8bboYmHVY7GDU")

echo "$(date '+%Y-%m-%d %H:%M:%S') — Starting swipe file download (rate-limit safe)" | tee "$LOG"
echo "Destination: $DEST_DIR" | tee -a "$LOG"
echo "Delay between folders: ${DELAY}s" | tee -a "$LOG"
echo "Total folders: ${#FOLDERS_1_NAMES[@]} (folder 1) + ${#FOLDERS_2_NAMES[@]} (folder 2)" | tee -a "$LOG"
echo "" | tee -a "$LOG"

SUCCESS=0
FAIL=0
SKIP=0
CONSECUTIVE_FAILS=0

# Download folder 1 subfolders one by one
echo "━━━ Folder 1: Copy Resources and Swipes ━━━" | tee -a "$LOG"

for i in "${!FOLDERS_1_NAMES[@]}"; do
  name="${FOLDERS_1_NAMES[$i]}"
  id="${FOLDERS_1_IDS[$i]}"
  dest="$DEST_DIR/copy-resources-and-swipes/$name"

  # Skip if already downloaded
  if [[ -d "$dest" ]] && [[ $(find "$dest" -type f 2>/dev/null | wc -l) -gt 0 ]]; then
    echo "[SKIP] $name (already exists)" | tee -a "$LOG"
    SKIP=$((SKIP + 1))
    continue
  fi

  echo "[DL] $name ..." | tee -a "$LOG"
  mkdir -p "$dest"

  if $GDOWN --folder "https://drive.google.com/drive/folders/$id" -O "$dest" --remaining-ok 2>>"$LOG"; then
    file_count=$(find "$dest" -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "  ✓ $file_count files" | tee -a "$LOG"
    SUCCESS=$((SUCCESS + 1))
    CONSECUTIVE_FAILS=0
  else
    echo "  ✗ FAILED (rate limit or permission)" | tee -a "$LOG"
    FAIL=$((FAIL + 1))
    CONSECUTIVE_FAILS=$((CONSECUTIVE_FAILS + 1))

    if [[ $CONSECUTIVE_FAILS -ge 3 ]]; then
      echo "" | tee -a "$LOG"
      echo "⚠ 3 consecutive failures — pausing 120s before retry" | tee -a "$LOG"
      sleep 120
      CONSECUTIVE_FAILS=0
    fi
  fi

  sleep $DELAY
done

# Download Links doc
echo "" | tee -a "$LOG"
echo "[DL] Links To Existing or Current Funnels.docx ..." | tee -a "$LOG"
$GDOWN "https://drive.google.com/uc?id=$LINKS_DOC_ID" -O "$DEST_DIR/copy-resources-and-swipes/Links To Existing or Current Funnels.docx" 2>>"$LOG" && echo "  ✓" | tee -a "$LOG" || echo "  ✗" | tee -a "$LOG"

# Folder 2 — skip duplicates already in folder 1
echo "" | tee -a "$LOG"
echo "━━━ Folder 2: Copy Resources and Swipes-1 (skipping duplicates) ━━━" | tee -a "$LOG"

for i in "${!FOLDERS_2_NAMES[@]}"; do
  name="${FOLDERS_2_NAMES[$i]}"
  id="${FOLDERS_2_IDS[$i]}"
  [[ "$id" == "UNKNOWN" ]] && { echo "[SKIP] $name (ID unknown)" | tee -a "$LOG"; continue; }

  # Check if already downloaded in folder 1
  if [[ -d "$DEST_DIR/copy-resources-and-swipes/$name" ]]; then
    echo "[SKIP] $name (exists in folder 1)" | tee -a "$LOG"
    continue
  fi

  dest="$DEST_DIR/copy-resources-and-swipes-1/$name"
  mkdir -p "$dest"
  echo "[DL] $name ..." | tee -a "$LOG"
  $GDOWN --folder "https://drive.google.com/drive/folders/$id" -O "$dest" --remaining-ok 2>>"$LOG" && echo "  ✓" | tee -a "$LOG" || echo "  ✗" | tee -a "$LOG"
  sleep $DELAY
done

# Summary
echo "" | tee -a "$LOG"
echo "━━━ SUMMARY ━━━" | tee -a "$LOG"
TOTAL_FILES=$(find "$DEST_DIR" -type f ! -name "download.log" ! -name ".DS_Store" | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "$DEST_DIR" 2>/dev/null | cut -f1)
echo "Success: $SUCCESS | Failed: $FAIL | Skipped: $SKIP" | tee -a "$LOG"
echo "Total files: $TOTAL_FILES" | tee -a "$LOG"
echo "Total size: $TOTAL_SIZE" | tee -a "$LOG"
echo "$(date '+%Y-%m-%d %H:%M:%S') — Download complete" | tee -a "$LOG"
