import { describe, test, after } from 'node:test';
import request from 'supertest';
import app from '#src/app.js';
import conexao from '#db/singleton-connection.js';
import assert from 'node:assert';
import { criarLivro } from '#test/factories/livro.factory.js';

describe('Registrar Venda', () => {
  after(async () => {
    await conexao.destroy();
  });

  test('Registra uma venda no Boleto', async () => {
    // Arrange
    const livro = await criarLivro({ titulo: 'Livro Teste' });

    // Act
    const response = await request(app)
      .post('/vendas')
      .send({
        idLivro: livro.id,
        modoPagamento: 'BOLETO',
        valor: 100,
      })
      .expect(201)
      .then((response) => response.body.content);

    // Assert
    assert.strictEqual(response.idLivro, livro.id);
    assert.strictEqual(response.modoPagamento, 'BOLETO');
    assert.strictEqual(response.valor, 100);
  });
});
