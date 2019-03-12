require('dotenv').config();
const amqp = require('amqplib/callback_api');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const amqpUrl = process.env.AMQP_URL || 'amqp://testes:Senhadificil1@localhost';

const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})); 

app.get('/rate', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

app.post('/api/rate', function(req, res) {
  var mensagem = JSON.stringify(req.body);
  
  amqp.connect(amqpUrl, (err, conn) => {
    conn.createChannel((err, ch) => {
      ch.assertQueue('', { exclusive: true }, (err, q) => {
        const corr = uuid();
  
        ch.consume(q.queue, (msg) => {
          if (msg.properties.correlationId === corr) {
            console.log(` [.] Retorno: ${msg.content.toString()}`);
            res.sendFile('public/thanks.html', { root: __dirname });
         }
        }, {noAck: true});
  
        console.log(` [x] Enviando mensagem: ${mensagem}`);
        ch.sendToQueue('rpc_queue',
          new Buffer(mensagem.toString()),
          { correlationId: corr, replyTo: q.queue });
      });
    });
  });
});

app.listen(port, () => {
  console.log(' [x] Servidor iniciado na porta: %s', port);
});