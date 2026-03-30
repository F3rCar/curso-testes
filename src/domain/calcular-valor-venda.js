const taxas = {
  CARTAO_CREDITO: 1.05,
  CARTAO_DEBITO: 1.02,
  BOLETO: 1,
  DINHEIRO: 1,
  PIX: 0.95,
};

export function calcularValorVenda(valor, modoPagamento) {
  const multiplicador = taxas[modoPagamento];
  if (multiplicador === undefined) {
    throw new Error(`Modo de pagamento inválido: ${modoPagamento}`);
  }

  return Math.round(valor * multiplicador);
}
