const amqp = require('amqplib/callback_api');

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';

amqp.connect(amqpUrl, (err, conn) => {
  conn.createChannel(function(err, ch) {
    var q = 'queue';
    ch.assertQueue(q, {durable: false});

    /* Processar mensagem aqui */
    console.log(" [*] Aguardando mensagem em %s. Para sair pressone CTRL+C", q);
    
    ch.consume(q, function(msg) {
      console.log(" [x] Recebido: %s", msg.content.toString());
    }, {noAck: true});
  });
});
