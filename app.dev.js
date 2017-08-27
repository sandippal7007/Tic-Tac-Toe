var express = require('express');
var morgan = require('morgan');
var path = require('path');
var http = require('http');
const bodyParser = require('body-parser');
var redis = require("redis"),
    client = redis.createClient();
var hostname = 'localhost';
var port = '3000';

var app = express();

morgan.token('istDate', function(req, res) {
  return new Date();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(morgan("Resquest: :istDate :method :url"));
app.use((req,res,next)=>{
  console.log(req.method+","+req.url);
  //res.send();
  next();
})

// app.use(express.static(path.join(__dirname,'/public')));
app.get('/', (req, res) => {res.send('Hi');});
app.post('/tic-tac', (req, res) => {

  // console.log(req.body);
  client.on("error", function (err) {
    console.log("Error " + err);
  });

var multi = client.multi() ;
multi.rpush("tic-tac", JSON.stringify({"index": req.body.index, "value": req.body.value}));
multi.exec(function(errors, results) {
  res.send(200);

})
  // client.append();
  // client.set("tic-tac", JSON.stringify({"index": req.body.index, "value": req.body.value}));
})
app.get('/tic-tac', (req, res) => {
  client.lrange('tic-tac', 0, 10, function(err, reply) {
    res.send(reply);
});
})
app.post('/tic-tac-delete', (req, res) => {
  client.del('tic-tac', function(err, reply) {
    console.log(reply, 'reply');
    res.send(200);
  });
})

app.listen(port,hostname,()=>{
  console.log("Started HTTP server on port",port);
})
