var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var dbhost = "127.0.0.1",
    dbport = 27017;

var db=new mongo.Db("Bank-App", new mongo.Server(dbhost,dbport, {}));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Signin');
});
router.post('/',function(req, res) {
  var username=  req.body.username,
      password=req.body.password;
  if(username&&password) {
    db.open(function (error) {
      if (error) {
        console.log("Unable to connect to DB" + error);
      }
      else {
        db.collection('user', function (error, collection) {
          collection.find({'userName': username, 'password': password}, function (error, result) {
            if (error) {
              console.log("Unable to find DB query" + error);
            }
            else if (result) {
              console.log("Success Signin \r\n CustomerName: " + result);
            }
            else {
              console.log("Failure");
            }
          });
        });
      }
    });
  }

  res.render('Bank',{'username': username});
});

router.param('username',function(req,res,next,username){
  req.username =username;
  next();
});
router.get('/deposit/:username', function(req, res, next) {
  res.render('deposit');
});
router.post('/deposit/:username',function(req,res){
  console.log(req.username);
  var username= req.username;
  var deposit;
  if(req.body['deposit']) {
    db.open(function (error) {
      if (error) {
        console.log("Unable to connect to DB" + error);
      }
      else {
        db.collection('user', function (error, collection) {
          collection.find({'userName': username}).nextObject( function(error, result) {
            if (error) {
              console.log("Unable to Update" + error);
            }
            else if (result) {
              result.deposit=parseInt(result.deposit) +parseInt(req.body['deposit']);
              deposit=result.deposit;
              console.log("result.deposit" +result.deposit);
              console.log('sucess');
            }
            else {
              console.log('failure');
            }
            collection.updateOne({'userName': username}, {$set: {'deposit': deposit}}, function (error, result) {
              if (error) {
                console.log("Unable to Update" + error);
              }
              else if (result) {
                console.log('sucess');
              }
              else {
                console.log('failure');
              }
            });
          });
        });
      }
    });
  }
  res.render('Bank',{'username': username});
});
//new lines
router.get('/withdraw/:username', function(req, res, next) {
  res.render('withdraw');
});
router.post('/withdraw/:username',function(req,res){
  console.log(req.username);
  var username= req.username;
  var withdraw;
  if(req.body['withdraw']) {
    db.open(function (error) {
      if (error) {
        console.log("Unable to connect to DB" + error);
      }
      else {
        db.collection('user', function (error, collection) {
          collection.find({'userName': username}).nextObject( function(error, result) {
            if (error) {
              console.log("Unable to Update" + error);
            }
            else if (result) {
              withdraw=parseInt(result.deposit) -parseInt(req.body['withdraw']);
              //withdraw=result.withdraw;
              console.log("result.withdraw" +withdraw);
              console.log('sucess');
            }
            else {
              console.log('failure');
            }
            collection.updateOne({'userName': username}, {$set: {'withdraw': withdraw}}, function (error, result) {
              if (error) {
                console.log("Unable to Update" + error);
              }
              else if (result) {
                console.log('sucess');
              }
              else {
                console.log('failure');
              }
            });
          });
        });
      }
    });
  }
  res.render("mainbank",{'username':username});
});

module.exports = router;