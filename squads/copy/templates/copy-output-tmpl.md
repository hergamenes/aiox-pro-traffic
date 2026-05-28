# copy-output-tmpl.md
# Template canônico para ativos persistidos do copy squad

artifact:
  id: "{ARTIFACT_ID}"
  squad: "copy"
  version: "1.0.0"
  lifecycle_state: "draft"
  generated_at: "{DATE}"
  owner: "{ACCOUNTABLE_HUMAN}"

briefing:
  objective: "{OBJETIVO_DO_ASSET}"
  audience: "{ICP_PRINCIPAL}"
  awareness_level: "{AWARENESS_LEVEL}"
  offer: "{OFERTA_ASSOCIADA}"
  channel: "{CANAL}"

asset_spec:
  asset_type: "{sales-page|email|landing-page|vsl|ad-copy|other}"
  format: "{markdown|plain-text}"
  primary_goal: "{conversion_goal}"
  voice_reference: "{expert_or_voice_dna}"

quality_gates:
  checklist_used:
    - "{CHECKLIST_1}"
  thresholds:
    clarity_score_min: "{0.80}"
    voice_match_score_min: "{0.85}"

copy_body: |
  {CONTEUDO_FINAL}

handoff:
  approved_by: "{APPROVER}"
  next_step: "{NEXT_STEP}"
  notes: "{OBSERVACOES}"
