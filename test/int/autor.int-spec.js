import test, { after, before, describe } from 'node:test';
import Autor from '#models/autor.js';
import assert from 'node:assert';
import conexao from '#db/singleton-connection.js';
import { limparBanco } from '#src/commands/limpar-banco.command.js';

describe('Autor', () => {
  before(async () => {
    Autor.configurarDB(conexao);
    await limparBanco();
  });

  after(async () => {
    await conexao.destroy();
  });

  describe('pegarAutores', () => {
    test('Retorna uma lista de autores', async () => {
      // Arrange
      const autoresEsperados = await conexao('autores')
        .insert([
          {
            nome: 'C. S. Lewis',
            nacionalidade: 'Britânica',
          },
          {
            nome: 'J. K. Rowling',
            nacionalidade: 'Britânica',
          },
        ])
        .returning('*');

      // Act
      const autoresDoBanco = await Autor.pegarAutores();

      // Assert
      assert.deepStrictEqual(autoresDoBanco, autoresEsperados);
    });
  });

  describe('criar', () => {
    test('Cria um novo autor no banco de dados', async () => {
      // Arrange
      const autor = new Autor({
        nome: 'George R. R. Martin',
        nacionalidade: 'Americana',
      });

      // Act
      const autorCriado = await autor.criar();

      // Assert
      assert.strictEqual(autorCriado.nome, autor.nome);
      assert.strictEqual(autorCriado.nacionalidade, autor.nacionalidade);
      assert(typeof autorCriado.id === 'number');

      const autorNoBanco = await conexao('autores')
        .where({ id: autorCriado.id })
        .first();

      assert.deepStrictEqual(autorNoBanco, autorCriado);
    });
  });
});
