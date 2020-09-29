// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var buscaCep = require("busca-cep");
var mysql = require("mysql");
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

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

app.post("/cursowebhook", (request, response) => {
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
        
        var connection = mysql.createConnection({
          host     : process.env.MYSQL_HOST,
          user     : process.env.MYSQL_USER,
          password : process.env.MYSQL_PASSWORD,
          database : process.env.MYSQL_DB
        });
      
      connection.connect();
        
     connection.query("insert into 3280724_lucas.alunos values ('"+aluno_nome+"','"
                      +aluno_cpf+"','"
                      +aluno_curso+"','"
                      +aluno_endereco+"')",
                      
    function (error, results, fiels){
       if(error) throw error;
       connection.end();
       
       response.json({"fulfillmentText":"Voce foi cadastrado para o nosso processo seletivo - Verifique a data das prova"})
     });
        
        
  })
  
      
    }
    
  
  
  
  
  
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
