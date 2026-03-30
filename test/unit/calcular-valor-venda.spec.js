import test, { describe } from 'node:test';
import { calcularValorVenda } from '#domain/calcular-valor-venda.js';
import assert from 'node:assert';

describe('calcularValorVenda', () => {
  const casosTeste = [
    { valor: 100, modoPagamento: 'CARTAO_CREDITO', valorEsperado: 105 },
    { valor: 100, modoPagamento: 'CARTAO_DEBITO', valorEsperado: 102 },
    { valor: 100, modoPagamento: 'BOLETO', valorEsperado: 100 },
    { valor: 100, modoPagamento: 'DINHEIRO', valorEsperado: 100 },
    { valor: 100, modoPagamento: 'PIX', valorEsperado: 95 },
  ];

  casosTeste.forEach(({ valor, modoPagamento, valorEsperado }) => {
    test(`Quando o valor é ${valor} e o modo de pagamento é ${modoPagamento}, o valor final deve ser ${valorEsperado}`, () => {
      const valorFinal = calcularValorVenda(valor, modoPagamento);

      assert.strictEqual(valorFinal, valorEsperado);
    });
  });

  test('Lança erro para modo de pagamento inválido', () => {
    // Arrange
    const valor = 100;
    const modoPagamento = 'CHEQUE';

    // Act
    const callbackQueLancaErro = () => calcularValorVenda(valor, modoPagamento);

    // Assert
    assert.throws(callbackQueLancaErro, {
      message: 'Modo de pagamento inválido: CHEQUE',
    });
  });
});
