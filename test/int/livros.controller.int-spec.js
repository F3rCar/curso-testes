import test, { after, before, describe, mock } from 'node:test';
import conexao from '#db/singleton-connection.js';
import { LivrosController } from '#controllers/livros.controller.js';
import { limparBanco } from '#src/commands/limpar-banco.command.js';
import assert from 'node:assert';
import { criarLivro } from '#test/factories/livro.factory.js';

describe('LivrosController', () => {
  before(async () => {
    await limparBanco();
  });

  after(async () => {
    await conexao.destroy();
  });

  const controller = new LivrosController(conexao);
  describe('buscarLivroPorId', () => {
    test('deve retornar 404 para um livro inexistente', async () => {
      const req = {
        params: {
          id: 9999,
        },
      };
      const res = {
        status: mock.fn(() => res),
        json: mock.fn(() => res),
      };

      await controller.buscarLivroPorId(req, res);

      // Precisamos verificar se o status foi chamado com 404 e o metodo json foi chamado com a mensagem correta
      const chamadasStatus = res.status.mock.calls;
      assert.strictEqual(res.status.mock.callCount(), 1);
      assert.strictEqual(chamadasStatus[0].arguments[0], 404);

      const chamadasJson = res.json.mock.calls;
      assert.strictEqual(res.json.mock.callCount(), 1);
      assert.deepStrictEqual(chamadasJson[0].arguments[0], {
        message: 'Livro não encontrado',
      });
    });
    test('deve retornar um livro existente', async () => {
      // Arrange
      const livro = await criarLivro({ titulo: 'Livro Existente' });

      const req = {
        params: {
          id: livro.id,
        },
      };
      const res = {
        status: mock.fn(() => res),
        send: mock.fn(() => res),
      };

      // Act
      await controller.buscarLivroPorId(req, res);

      // Assert
      const chamadasStatus = res.status.mock.calls;
      const chamadasSend = res.send.mock.calls;

      assert.strictEqual(chamadasStatus[0].arguments[0], 200);
      assert.deepStrictEqual(chamadasSend[0].arguments[0], livro);
    });
  });
  describe('listarLivros', () => {});
  describe('cadastrarLivro', () => {});
});
