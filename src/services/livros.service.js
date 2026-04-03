import Livro from '#models/livro.js';

export class LivrosService {
  constructor(databaseConnection) {
    Livro.configurarDB(databaseConnection);
  }

  async listarLivros() {
    const resultado = await Livro.pegarLivros();
    return resultado;
  }
}
