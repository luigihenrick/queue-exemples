require('dotenv').config();
const amqp = require('amqplib/callback_api');
const uuid = require('uuid');

const mensagem = process.argv.slice(2);
const amqpUrl = process.env.AMQP_URL || 'amqp://testes:Senhadificil1@localhost';

amqp.connect(amqpUrl, (err, conn) => {
  conn.createChannel((err, ch) => {
    ch.assertQueue('', { exclusive: true }, (err, q) => {
      const corr = uuid();
      console.log(` [x] Enviando mensagem: ${mensagem}`);

      ch.consume(q.queue, (msg) => {
        if (msg.properties.correlationId === corr) {
          console.log(` [.] Retorno: ${msg.content.toString()}`);
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
       }
      }, {noAck: true});

      ch.sendToQueue('rpc_queue',
        new Buffer(mensagem.toString()),
        { correlationId: corr, replyTo: q.queue });
    });
  });
});
