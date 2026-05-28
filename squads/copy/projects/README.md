# Copy Projects - Estrutura Padrão

> Cada projeto Copy YOLO segue esta estrutura padronizada.

## Estrutura de Diretórios

```
squads/copy/
├── scripts/
│   └── copy.sh              # Main bash loop (YOLO mode)
├── workflows/
│   ├── wf-1-full-launch.yaml
│   ├── wf-2-paid-traffic.yaml
│   ├── wf-3-high-ticket.yaml
│   ├── wf-4-organic-content.yaml
│   ├── wf-5-email-marketing.yaml
│   ├── wf-6-funnel-optimization.yaml
│   └── wf-7-direct-mail.yaml
├── templates/
│   ├── copy-state.json      # State template
│   ├── prompt-copy.md       # Prompt template
│   └── progress-copy.txt    # Progress template
└── projects/
    └── {project-name}/      # Each project
        ├── prd.json         # Project requirements
        ├── prompt.md        # Agent instructions
        ├── progress.txt     # Session log
        ├── copy-state.json  # Runtime state (created during execution)
        ├── handoff.md       # Context between stories/phases
        ├── logs/            # Execution logs
        └── outputs/         # Generated artifacts
```

## Criando um Novo Projeto

1. Criar diretório em `projects/{project-name}/`
2. Criar arquivos obrigatórios:
   - `prd.json` - PRD com user stories
   - `prompt.md` - Instruções do agente
   - `progress.txt` - Log de progresso (pode usar template)
3. Criar diretórios:
   - `logs/` - Para logs de execução
   - `outputs/` - Para artefatos gerados

## Arquivos por Projeto

### prd.json
Contém:
- Informações do projeto
- Decision matrix answers
- User stories com acceptance criteria
- Dependencies entre stories

### prompt.md
Instruções para o agente Claude executar o projeto:
- Contexto do projeto
- Variáveis de ambiente
- Regras de execução
- Seções autorizadas para edição

### progress.txt
Log de sessão e progresso:
- Codebase Patterns (aprendizados)
- File List (arquivos criados/modificados)
- Quality Gates Status
- Session Log

### copy-state.json
Estado persistente entre iterações:
- Current phase/task
- Artifacts generated
- Checkpoints passed
- Clone combinations used

### handoff.md
Contexto mínimo para continuidade:
- Estado atual
- Learnings críticos
- Erros a evitar
- Próxima story

### outputs/
Artefatos gerados durante execução:
- Copy final
- Headlines
- Emails
- VSLs
- Sales pages
- etc.

## Execução

```bash
# Executar projeto com copy.sh
./squads/copy/scripts/copy.sh projects/my-project/

# Com limite de iterações
./squads/copy/scripts/copy.sh projects/my-project/ 10
```

## Completion Signals

O sistema usa signals para comunicação:
- `<promise>COMPLETE</promise>` - Projeto completo
- `<promise>CHECKPOINT:PHASE-X</promise>` - Checkpoint atingido
- `<promise>BLOCKED:T-X.Y</promise>` - Task bloqueado

---
*Copy Squad v2.0*
