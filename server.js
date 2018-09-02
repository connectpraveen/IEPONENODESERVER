//server.js
var express=require("express");
var app=express();
var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//routes
app.get('/',function(req,res){
    res.send('Hello, this server will handle Braintree payments! ');
});

//braintree
var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "q3w4qgfjc3h3cv7f",
  publicKey: "ghm559w9cmckhb9s",
  privateKey: "1a23acfa0df66539fe424d4e839545cf"
});
gateway.clientToken.generate({
  }, function (err, response) {
    var clientToken = response.clientToken
  });
app.get("/client_token", function (req, res) {
  var Ctoken={"token":""};
// message
// {"course":[{"id":3,"information":"test","name":"course1"}],"name":"student"}
    gateway.clientToken.generate({}, function (err, response) {
      //res.send(response.clientToken);
      Ctoken.token= response.clientToken;
      res.send(Ctoken);
    });
});  
app.post("/checkout", function (req, res) {
   var nonceFromTheClient = req.body.nonce;
   var ChargedAmount=req.body.chargeAmount;
     gateway.transaction.sale({
        amount: ChargedAmount,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
        console.log(result);
        res.send(result);
      });  

  });


//port
app.listen('3000',function(){
console.log('Node server listning on PORT 3000!');
});