var express = require('express');
const mtg = require('mtgsdk');
const https = require('https');
var sql = require('mssql')
var mysql = require('mysql')
var Request = require("request");
var router = express.Router();


const connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cardswap"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

router.get('/findcardView', function(req, res, next) {
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: ''});
});

router.post('/api/login/', function(req, res) {
  const username = req.body.username
  const password = req.body.password

  connect.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
    connect.query('SELECT * FROM user', function(err, result) {
      if(err) console.log(err)
      if(result[0].name === username && result[0].password === password){
        res.render('findcardView', {page:'Find a Card', 
                                    menuId:'findCard',
                                    imageUrl: ''});
      }
    });
  });
});

router.post('/api/findCard/', function(req, res) {
  const cardName = req.body.cardName
  const optionMTG = req.body.optionMTG
  const optionYUGIOH = req.body.optionYUGIOH
  var cardFound;
  var cardFoundImageUrl;

  if(optionMTG){
    mtg.card.where({ name: cardName})
    .then(cards => {
      cardFound = cards[0]
      cardFoundImageUrl = cardFound.imageUrl
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: cardFoundImageUrl});
    });
  } else if(optionYUGIOH){
    const request = 'https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName
    Request.get(request, (error, response, body) => {
      if(error) {
        return console.log(error);
      }
      const cardsFound = JSON.parse(body);
      cardFound = cardsFound[0];
      cardFoundImageUrl = cardFound["card_images"][0].image_url;
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: cardFoundImageUrl});
    });

  } else{

  }

  
});

module.exports = router;
