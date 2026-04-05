export class EmailGateway {
  async enviarEmail({ remetente, destinatario, assunto, mensagem }) {
    console.log(
      `Enviando email de ${remetente} para ${destinatario} com assunto "${assunto}" e mensagem: ${mensagem}`,
    );
  }
}
