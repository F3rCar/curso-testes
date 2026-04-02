import { LivrosController } from '#controllers/livros.controller.js';
import test, { after, describe, mock } from 'node:test';
import conexao from '#db/singleton-connection.js';
import { criarLivro } from '#test/factories/livro.factory.js';
import { assertMock } from '#test/utils/mock.assertions.js';

describe('LivrosController', () => {
  const sut = new LivrosController(conexao);

  after(async () => {
    await conexao.destroy();
  });

  describe('listarLivros', () => {
    test('Retorna uma lista de livros', async () => {
      // Arrange
      const livro = await criarLivro({ titulo: 'Livro Teste' });
      const req = {};
      const resSpy = {
        status: mock.fn(() => resSpy),
        json: mock.fn(() => resSpy),
        send: mock.fn(() => resSpy),
      };

      // Act
      await sut.listarLivros(req, resSpy);

      // Arrange
      assertMock(resSpy.status).wasCalledWith(200);
      assertMock(resSpy.send).wasCalledWith([livro]);
    });
  });
  describe('buscarLivroPorId', () => {});
  describe('cadastrarLivro', () => {});
});
