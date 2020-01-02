var express = require('express');
const mtg = require('mtgsdk');
const https = require('https');
var sql = require('mssql')
var mysql = require('mysql')
var Request = require("request");
var router = express.Router();

var sessionUsername
var sessionUserId

var selectedCardName
var selectedCardImageUrl
var selectedCardId
var selectedCardDBID
var selectedCardGame

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
                              imageUrl: '',
                              cardFound: false});
});

router.post('/api/login/', function(req, res) {
  const username = req.body.username
  const password = req.body.password

  connect.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
    connect.query('SELECT * FROM user WHERE name = ' +  mysql.escape(username), function(err, result) {
      if(err) console.log(err)
      if(result[0].name === username && result[0].password === password){
        sessionUsername = username
        sessionUserId = result[0].id
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

  if(optionMTG){
    mtg.card.where({ name: cardName})
    .then(cards => {
      cardFound = cards[0]
      selectedCardName = cardFound.name
      selectedCardId  = cardFound.id
      selectedCardImageUrl = cardFound.imageUrl
      selectedCardGame = "MTG"
      insertCard(selectedCardName, selectedCardId, selectedCardImageUrl, selectedCardGame);
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: selectedCardImageUrl,
                                  cardFound: true});
      
    });
  } else if(optionYUGIOH){
    const request = 'https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName
    Request.get(request, (error, response, body) => {
      if(error) return console.log(error);
      const cardsFound = JSON.parse(body);
      cardFound = cardsFound[0];
      selectedCardName = cardFound.name
      selectedCardId  = cardFound.id
      selectedCardImageUrl = cardFound["card_images"][0].image_url
      selectedCardGame = "YUGIOH"
      insertCard(selectedCardName, selectedCardId, selectedCardImageUrl, selectedCardGame);
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: selectedCardImageUrl,
                                  cardFound: true});
    });
  } else{}
});

router.post('/api/sellCard/', function(req, res) {
  res.render('sellcardView', {page:'Sell a Card', 
                              menuId:'sellCard',
                              imageUrl: selectedCardImageUrl,
                              mode: "SELL",
                              cardFound: true});
});

router.post('/api/buyCard/', function(req, res) {
  res.render('sellcardView', {page:'Sell a Card', 
                              menuId:'sellCard',
                              imageUrl: selectedCardImageUrl,
                              mode: "BUY",
                              cardFound: true});
});

router.post('/api/addCardToShop', function(req, res) {
  insertCardUser(selectedCardDBID, sessionUserId);
  findSellers(selectedCardDBID)
  res.render('sellcardView', {page:'Sell a Card', 
                              menuId:'sellCard',
                              imageUrl: selectedCardImageUrl,
                              mode: "SELL",
                              cardFound: true});
});

router.post('/api/addCardToAnnonce', function(req, res) {
  insertCardAnnonce(selectedCardDBID, sessionUserId);
  findBuyers(selectedCardDBID)
  res.render('sellcardView', {page:'Sell a Card', 
                              menuId:'sellCard',
                              imageUrl: selectedCardImageUrl,
                              mode: "BUY",
                              cardFound: true});
});

function insertCard(name, id, imageUrl,  game){
  connect.query("SELECT * FROM card WHERE game = " + mysql.escape(game) + 
                                  "AND card_id = " + mysql.escape(id), function(err, result) {
    if(err) console.log(err)
    if(!result[0]){
      var sqlQuery = "INSERT INTO card (game, name, card_id,  image_url) VALUES ?";
      var sqlValues = [[game, name, id, imageUrl]];
      connect.query(sqlQuery,  [sqlValues], function(err, result) {
        if (err) throw err;
        selectedCardDBID = result.insertId
      });
    } else {
      selectedCardDBID = result[0].id
    }
  });
}

function insertCardUser(cardId, userId){
  var sqlQuery = "INSERT INTO card_user (card_id, user_id) VALUES ?";
  var sqlValues = [[cardId, userId]];
  connect.query(sqlQuery,  [sqlValues], function(err, result) {
    if (err) throw err;
  });
}

function insertCardAnnonce(cardId, userId){
  var sqlQuery = "INSERT INTO annonces (card_id, user_id) VALUES ?";
  var sqlValues = [[cardId, userId]];
  connect.query(sqlQuery,  [sqlValues], function(err, result) {
    if (err) throw err;
  });
}

function findSellers(cardId){
  connect.query("SELECT user_id FROM card_user WHERE card_id = " + mysql.escape(cardId), function(err, result) {
    if (err) throw err;
    console.log("FIND SELLERS")
    console.log(result)
  });
}

function findBuyers(cardId){
  connect.query("SELECT user_id FROM annonces WHERE card_id = " + mysql.escape(cardId), function(err, result) {
    if (err) throw err;
    console.log("FIND BUYERS")
    console.log(result)
  });
}



module.exports = router;
