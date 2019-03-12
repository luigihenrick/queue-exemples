const amqp = require('amqplib/callback_api');

const mensagem = process.argv.slice(2);

amqp.connect('amqp://testes:Senhadificil1@localhost', (err, conn) => {

  conn.createChannel((err, ch) => {
    var q = 'queue';

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer(mensagem.toString()));
    
    console.log(` [x] Enviado: '${mensagem}'`);
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
  });
});
