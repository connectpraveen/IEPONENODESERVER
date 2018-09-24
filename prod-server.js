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
  res.setHeader('Access-Control-Allow-Origin', 'https://iepone-account-web.appspot.com');
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
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'consultant.iepone@gmail.com',
    pass: 'P@ssw0rd@123'
  }
});
app.post("/sendemail", function (req, res) {
  var serverURL = req.body.serverURL;
  var mailTo = req.body.mailTo;
  var mailOptions = {
    from: 'consultant.web@iepone.com',
    to: mailTo,
    subject: 'Verification Link IEPONE',
    html: 'click  <a href='+serverURL+'>here</a> to verify. <br> Thanks, <br> IEPONE Team'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      res.send('success');
    }
  });
});

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId:   '9y7n444xd5sckv3g',
  publicKey:    'ndt38dhdrygqwrt6',
  privateKey:   '39a49e76f9e487e8f12f38405806ea60'
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
  var uniq=new Date().getTime();
  console.log(req.body);
   var nonceFromTheClient = req.body.nonce;
   var price=req.body.chargeAmount;
   gateway.customer.create({
    firstName:'IEPONE',
    lastName:uniq,
    paymentMethodNonce: nonceFromTheClient
  }, function (err, result) {
    result.success;
    // true
  
    result.customer.id;
    // e.g 160923
    gateway.subscription.create({
      paymentMethodToken: result.customer.paymentMethods[0].token,
      planId: "iepone-subscription",
      price: price,
    }, function (err, result) {
      res.send(result);
    });
 
  });

 
    //  gateway.transaction.sale({
    //     amount: ChargedAmount,
    //     paymentMethodNonce: nonceFromTheClient,
    //     options: {
    //       submitForSettlement: true
    //     }
    //   }, function (err, result) {
    //     console.log(result);
    //     res.send(result);
    //   });  

  });


//port
app.listen('8080',function(){
console.log('Node server listning on PORT 8080!');
});