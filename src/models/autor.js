class Autor {
  static db;

  static configurarDB(db) {
    this.db = db;
  }

  constructor({ id, nome, nacionalidade, created_at, updated_at }) {
    this.id = id;
    this.nome = nome;
    this.nacionalidade = nacionalidade;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static async pegarAutores() {
    return this.db.select('*').from('autores').orderBy('nome', 'asc');
  }

  static async pegarPeloId(id) {
    const resultado = await this.db.select('*').from('autores').where({ id });
    return resultado[0];
  }

  async criar() {
    const resultado = await Autor.db('autores').insert(this, '*');
    return resultado[0];
  }

  async atualizar(id) {
    // o update retorna a quantidade de rows atualizados e não o objeto do registro atualizado
    await Autor.db('autores')
      .where({ id })
      .update({ ...this, updated_at: new Date().toISOString() });

    return Autor.db.select('*').from('autores').where({ id });
  }

  static async excluir(id) {
    // o del retorna a quantidade de rows deletados
    await this.db('autores').where({ id }).del();
  }

  async salvar() {
    // verificar se o id existe no banco
    // se não existir é create
    // se existir é update
    if (this.id) {
      const resultado = await this.atualizar(this.id);
      return resultado;
    }
    const resultado = await this.criar();
    return resultado;
  }

  static async pegarLivrosPorAutor(autorId) {
    return this.db('livros').where({ autor_id: autorId });
  }
}

export default Autor;
