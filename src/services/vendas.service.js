import Venda from '#models/venda.js';
import Livro from '#models/livro.js';
import Editora from '#models/editora.js';
import { calcularValorVenda } from '#domain/calcular-valor-venda.js';
import { EmailGateway } from '#src/gateways/email.gateway.js';

export class VendasService {
  constructor(databaseConnection) {
    Venda.configurarDB(databaseConnection);
    Livro.configurarDB(databaseConnection);
    Editora.configurarDB(databaseConnection);
    this.emailGateway = new EmailGateway();
  }

  async registrarVenda({ idLivro, modoPagamento, valor }) {
    const valorFinal = calcularValorVenda(valor, modoPagamento);

    const venda = new Venda({
      livro_id: idLivro,
      valor: valorFinal,
      tipo_pagamento: modoPagamento,
    });

    const resultado = await venda.salvar();

    const livro = await Livro.pegarPeloId(idLivro);
    const editora = await Editora.pegarPeloId(livro.editora_id);

    await this.emailGateway.enviarEmail({
      remetente: 'no-reply@livraria.com',
      destinatario: editora.email,
      assunto: 'Nova venda registrada',
      mensagem: `Uma nova venda do livro "${livro.titulo}" foi registrada com o valor de R$ ${valorFinal}.`,
    });
    return resultado;
  }
}
