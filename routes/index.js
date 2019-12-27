var express = require('express');
const mtg = require('mtgsdk');
const https = require('https');
var sql = require('mssql')
var mysql = require('mysql')
var Request = require("request");
var router = express.Router();


const connect = mysql.createConnection({
  host: "localhost",
  port: "3308",
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
        res.render('homepage', {page:'Homepage', 
                                menuId:'homepage',  
                                username: username});
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
  var cardFoundId;
  var cardFoundName;
  var cardFoundGame;

  if(optionMTG){
    mtg.card.where({ name: cardName})
    .then(cards => {
      cardFound = cards[0]
      cardFoundImageUrl = cardFound.imageUrl
      cardFoundName = cardFound.name
      cardFoundId = cardFound.id
      cardFoundGame = "MTG"
      insertCard(cardFoundName, cardFoundId, cardFoundImageUrl, cardFoundGame);
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: cardFoundImageUrl});
    });
  } else if(optionYUGIOH){
    const request = 'https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName
    Request.get(request, (error, response, body) => {
      if(error) return console.log(error);
      const cardsFound = JSON.parse(body);
      cardFound = cardsFound[0];
      cardFoundName = cardFound.name
      cardFoundId = cardFound.id
      cardFoundImageUrl = cardFound["card_images"][0].image_url
      cardFoundGame = "YUGIOH"
      insertCard(cardFoundName, cardFoundId, cardFoundImageUrl, cardFoundGame);
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: cardFoundImageUrl});
    });
  } else{}
});

function insertCard(name, id, imageUrl,  game){
  connect.query("SELECT * FROM card WHERE game = " + mysql.escape(game) + 
                                       "AND id = " + mysql.escape(id), function(err, result) {
    if(err) console.log(err)
    if(!result[0]){
      var sqlQuery = "INSERT INTO card (game, name, card_id,  image_url) VALUES ?";
      var sqlValues = [[game, name, id, imageUrl]];
      connect.query(sqlQuery,  [sqlValues], function(err, result) {
        if (err) throw err;
      });
    }
  });
}

module.exports = router;
