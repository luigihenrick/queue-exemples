require('dotenv').config();
const amqp = require('amqplib/callback_api');

const amqpUrl = process.env.AMQP_URL || 'amqp://testes:Senhadificil1@localhost';

amqp.connect(amqpUrl, (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'rpc_queue';
    ch.assertQueue(q, { durable: false });
    ch.prefetch(1);

    console.log(' [x] Aguardando requisições RPC...');

    ch.consume(q, function reply(msg) {
      const mensagem = msg.content.toString();

      /* Processar mensagem aqui */
      console.log(` [.] Mensagem recebida via RPC: ${mensagem}`);
      
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(`Mensagem RPC processada pelo serviço node: '${mensagem}'.`),
        { correlationId: msg.properties.correlationId });
      ch.ack(msg);
    });
  });
});
