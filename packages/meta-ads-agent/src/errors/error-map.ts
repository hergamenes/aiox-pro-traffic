const META_ERROR_MAP: Record<number, { message: string; action: string }> = {
  1: {
    message: 'Erro desconhecido da API Meta',
    action: 'Tente novamente. Se persistir, contate o suporte',
  },
  2: {
    message: 'Erro temporário da API Meta',
    action: 'Tente novamente em alguns minutos',
  },
  4: {
    message: 'Limite de chamadas da API atingido',
    action: 'Aguarde alguns minutos',
  },
  10: {
    message: 'Permissão negada',
    action: 'Verifique permissões do Meta App',
  },
  17: {
    message: 'Conta atingiu o limite de campanhas',
    action: 'Exclua campanhas antigas ou contate o suporte Meta',
  },
  32: {
    message: 'Página indisponível',
    action: 'Verifique se a página está publicada e ativa',
  },
  100: {
    message: 'Parâmetro inválido',
    action: 'Verifique os parâmetros da requisição',
  },
  190: {
    message: 'Token de acesso inválido ou expirado',
    action: 'Execute: meta-ads auth setup',
  },
  200: {
    message: 'Permissão insuficiente para esta operação',
    action: 'Verifique permissões do App e da conta',
  },
  275: {
    message: 'Conta em modo somente leitura',
    action: 'Verifique restrições da conta no Gerenciador',
  },
  294: {
    message: 'Título do anúncio muito longo',
    action: 'Reduza o título para até 40 caracteres',
  },
  368: {
    message: 'Conta temporariamente bloqueada',
    action: 'Acesse o Gerenciador para resolver',
  },
  506: {
    message: 'Campanha duplicada detectada',
    action: 'Use um nome diferente para a campanha',
  },
  803: {
    message: 'Recurso não encontrado',
    action: 'Verifique se o ID informado existe',
  },
  900: {
    message: 'Limite de campanhas ativas atingido',
    action: 'Pause ou exclua campanhas existentes',
  },
  1487390: {
    message: 'Anúncio em processo de revisão',
    action: 'Aguarde a revisão da Meta (até 24h)',
  },
  1815149: {
    message: 'Erro de segmentação',
    action: 'Verifique as configurações de público',
  },
  2446: {
    message: 'Criativo rejeitado pela Meta',
    action: 'Verifique políticas de anúncios da Meta',
  },
  2635: {
    message: 'Orçamento diário abaixo do mínimo',
    action: 'O orçamento deve ser de pelo menos R$1,00 por dia',
  },
  80004: {
    message: 'Limite de taxa para anúncios atingido',
    action: 'Aguarde 1 minuto antes de tentar novamente',
  },
};

export function translateMetaError(
  code: number,
  detail?: string,
): { message: string; action: string } {
  const mapped = META_ERROR_MAP[code];

  if (mapped) {
    const message = detail
      ? `${mapped.message}: ${detail}`
      : mapped.message;
    return { message, action: mapped.action };
  }

  return {
    message: detail
      ? `Erro da API Meta (código ${code}): ${detail}`
      : `Erro da API Meta (código ${code})`,
    action: 'Tente novamente. Se persistir, contate o suporte',
  };
}
