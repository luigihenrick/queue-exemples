const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log(' [x] Aguardando requisições HTTP. Para sair pressione Ctrl+C...');
});

app.get('/:mensagem', (request, response) => {
  const mensagem = request.params.mensagem;
  
  /* Processar mensagem aqui */
  console.log(` [.] Mensagem recebida via HTTP: ${mensagem}`);

  response.status(200).json({
    result: `Mensagem HTTP processada pelo serviço node: '${mensagem}'`
  });
});
