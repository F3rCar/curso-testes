import { describe, test, after } from 'node:test';
import request from 'supertest';
import app from '#src/app.js';
import conexao from '#db/singleton-connection.js';
import assert from 'node:assert';

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

async function criarLivro(dadosParciais = {}) {
  const [autor] = await conexao('autores')
    .insert({
      nome: 'Autor Teste',
      nacionalidade: 'Teste',
    })
    .returning('*');

  const [editora] = await conexao('editoras')
    .insert({
      nome: 'Editora Teste',
      email: 'editora@teste.com',
      cidade: 'Cidade Teste',
    })
    .returning('*');

  const dadosLivro = {
    titulo: 'Test',
    paginas: 100,
    autor_id: autor.id,
    editora_id: editora.id,
    ...dadosParciais,
  };

  const [livro] = await conexao('livros').insert(dadosLivro).returning('*');

  return livro;
}
