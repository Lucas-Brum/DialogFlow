// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var buscaCep = require("busca-cep");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const {WebhookClient} = require('dialogflow-fulfillment');///add 



// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

app.post("/cursowebhook", function (request, response)  {
    ///new code
  const agent = new WebhookClient({ request:request, response:response });

  let intentMap = new Map();
  intentMap.set('validar.promocao', validar_promocao);

  agent.handleRequest(intentMap);

  function validar_promocao(agent){
    let idade = parseInt(agent.parameters.idade);
    
    if(idade >=18){
      agent.add('Tem que ter essa msg')
      agent.setFollowupEvent('cupons');
    }else{
      agent.add('heroku -- Essa promoção só é valida para maiores de 18 anos')
    }
  }
  /////new code end

  var intentName = request.body.queryResult.intent.displayName;

  if (intentName == "Processo.seletivo") {
    response.json({
      fulfillmentMessages: [
        {
          card: {
            title: "Processo seletivo",
            subtitle: "Bem vindo ao nosso processo seletivo",
            imageUri:
              "https://firebasestorage.googleapis.com/v0/b/agentezinho-9yji.appspot.com/o/processo%2FUntitled%20design.png?alt=media&token=fb70ac00-4c39-4bfa-aced-8a89564a4e65"
          }
        },
        {
          text: {
            text: [
              "Temos os melhores cursos nas áreas de humas,exatas e biológicas"
            ]
          }
        },
        {
          image: {
            imageUri:
              "https://vejasp.abril.com.br/wp-content/uploads/2018/07/campus-usp-10.jpg?quality=70&strip=info&w=1000",
            accessibilityText: "Temos campus em todas as cidades"
          }
        },
        {
          text: {
            text: ["Voce quer participar do processo seletivo?????"]
          }
        }
      ]
    });
  } else if(intentName == "Processo.seletivo - yes" ){
      
    var aluno_cep = request.body.queryResult.parameters['aluno-cep'];
    
    buscaCep(aluno_cep, {sync: false, timeout: 1000})
    .then(endereco => {
      
      var aluno_nome = request.body.queryResult.parameters['aluno-nome'];
      var aluno_cpf = request.body.queryResult.parameters['aluno-cpf'];
      var aluno_curso = request.body.queryResult.parameters['aluno-curso'];
      
      var aluno_endereco = endereco.logradouro+"-"+endereco.bairro+","+endereco.localidade+"-"+endereco.uf+"--"+endereco.cep;
      
      response.json({"fulfillmentText":"Voce foi cadastrado para o nosso processo seletivo - Verifique a data das prova"})
      
    

     const { Client } = require('pg');

      const client = new Client({
      host: 'ec2-54-224-124-241.compute-1.amazonaws.com',
      database: 'decps7e76fuc0u',
      user: 'atudzfubgxozep',
      password: '6b13d3dce3e4d3b658d2551587362b7a385d0ae494c63b3ffd9a55eaae0a712f',
      port: '5432'
      });

      client.connect();

      client.query("insert into alunos values ('"+aluno_nome+"','"
      +aluno_cpf+"','"
      +aluno_curso+"','"
      +aluno_endereco+"')", (err, res) => {

        if (err) throw err;
        for (let row of res.rows) {
          console.log(JSON.stringify(row));
        }
        client.end();

        response.json({"fulfillmentText":"Voce foi cadastrado para o nosso processo seletivo - Verifique a data das prova"})

      });
     
     
   });
      
      


    
  }
  





});





// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
console.log("Your app is listening on port " + listener.address().port);
});
