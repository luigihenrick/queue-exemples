var request = require('request');

const mensagem = process.argv.slice(2);

var options = {
  url: `http://localhost:3000/${mensagem}`,
  timeout: 5000
};

request(options,
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      setTimeout(function() { process.exit(0) }, 500);
      console.log(` [.] Retorno: ${body}`);
    } else {
      console.error(` [.] ${error}`)
    }
});
