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
      var q = 'queue';
  
      ch.assertQueue(q, {durable: false});
      ch.sendToQueue(q, new Buffer(mensagem.toString()));
      
      console.log(` [x] Enviado: '${mensagem}'`);
      setTimeout(function() { conn.close(); }, 500);
      res.sendFile('public/thanks.html', { root: __dirname });
    });
  });
});

app.listen(port, () => {
  console.log(' [x] Servidor iniciado na porta: %s', port);
});