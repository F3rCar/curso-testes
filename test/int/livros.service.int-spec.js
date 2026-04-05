import conexao from '#db/singleton-connection.js';
import { LivrosService } from '#src/services/livros.service.js';
import { criarLivro } from '#test/factories/livro.factory.js';
import assert from 'node:assert';
import test, { after, beforeEach, describe } from 'node:test';

describe('LivrosService', () => {
  const sut = new LivrosService(conexao);

  after(async () => {
    await conexao.destroy();
  });

  beforeEach(async () => {
    await conexao('livros').delete();
  });

  describe('listarLivros', () => {
    test('Retorna uma lista vazia quando não há livros cadastrados', async () => {
      const resultado = await sut.listarLivros();

      assert.deepStrictEqual(resultado, []);
    });
    test('Retorna uma lista de livros', async () => {
      // Arrange
      const livro1 = await criarLivro({ titulo: 'Livro Teste 1' });
      const livro2 = await criarLivro({ titulo: 'Livro Teste 2' });

      // Act
      const resultado = await sut.listarLivros();

      // Assert
      assert.deepStrictEqual(resultado, [livro1, livro2]);
    });
  });

  describe('buscarLivroPorId', () => {
    test('Retorna undefined quando o livro não existe', async () => {
      const resultado = await sut.buscarLivroPorId(9999);

      assert.strictEqual(resultado, undefined);
    });
    test('Retorna os dados do livro quando ele existe', async () => {
      const livro = await criarLivro({ titulo: 'Livro Teste 3' });

      const resultado = await sut.buscarLivroPorId(livro.id);

      assert.deepStrictEqual(resultado, livro);
    });
  });
});
