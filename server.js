//server.js
var express=require("express");
var app=express();
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
    gateway.clientToken.generate({}, function (err, response) {
      res.send(response.clientToken);
    });
});  
app.post("/checkout", function (req, res) {
    var nonceFromTheClient = req.body.payment_method_nonce;
    // Use payment method nonce here

    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: fake-valid-nonce,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
      });  

  });


//port
app.listen('3000',function(){
console.log('Node server listning on PORT 3000!');
});