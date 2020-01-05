var express = require('express');
const mtg = require('mtgsdk');
const https = require('https');
var sql = require('mssql')
var mysql = require('mysql')
var Request = require("request");
var fs = require('fs');
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
  myCss =  {
    style: fs.readFileSync("./css/style.css", "utf8")
  }
  res.render('index', {page:'Home', menuId:'home', myCss: myCss});
});

router.get('/findcardView', function(req, res, next) {
  myCss =  {
    style: fs.readFileSync("./css/findCardViewStyle.css", "utf8")
  }
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: '',
                              cardFound: false,
                              myCss: myCss});
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
        myCss =  {
          style: fs.readFileSync("./css/homepageStyle.css", "utf8")
        }
        res.render('homepage', {page:'Homepage', 
                                menuId:'homepage',  
                                username: username,
                                myCss: myCss});
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
      myCss =  {
        style: fs.readFileSync("./css/findCardViewStyle.css", "utf8")
      }
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: selectedCardImageUrl,
                                  cardFound: true,
                                  myCss: myCss});
      
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
      myCss =  {
        style: fs.readFileSync("./css/findCardViewStyle.css", "utf8")
      }
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: selectedCardImageUrl,
                                  cardFound: true,
                                  myCss: myCss});
    });
  } else{}
});

router.post('/api/sellCard/', function(req, res) {

  myCss =  {
    style: fs.readFileSync("./css/sellCardViewStyle.css", "utf8")
  }

  var userIDQuery = "SELECT user_id FROM annonces WHERE card_id = " + mysql.escape(selectedCardDBID)
  var result = []
  connect.query(userIDQuery, function(err, resultUser) {
    if(err) throw err;
    var i = 0
    var idsToFind  = ""
    while(resultUser[i]){
      idsToFind += "id = " + mysql.escape(resultUser[i].user_id) +  " OR "
      i++
    }
    if(idsToFind === ""){
      res.render('sellcardView', {page:'Sell a Card', 
                            menuId:'sellCard',
                            imageUrl: selectedCardImageUrl,
                            mode: "SELL",
                            cardFound: true,
                            myCss: myCss,
                            usersInfo: result});
    } else{
      idsToFind  = idsToFind.substring(0,  idsToFind.length - 3)
      var userInfoQuery = "SELECT * FROM user WHERE " + idsToFind
      connect.query(userInfoQuery, function(err, resultUserInfo) {
        if (err) throw err;
        var j = 0
        while(resultUserInfo[j]){
          var userInfo = {name: resultUserInfo[j].name, 
                          adress: resultUserInfo[j].adress,
                          id: resultUserInfo[j].id}
          result.push(userInfo)
          j++
        }
        res.render('sellcardView', {page:'Sell a Card', 
                                    menuId:'sellCard',
                                    imageUrl: selectedCardImageUrl,
                                    mode: "SELL",
                                    cardFound: true,
                                    myCss: myCss,
                                    usersInfo: result});
      });
    }
  });
});

router.post('/api/buyCard/', function(req, res) {

  myCss =  {
    style: fs.readFileSync("./css/sellCardViewStyle.css", "utf8")
  }

  var userIDQuery = "SELECT user_id FROM card_user WHERE card_id = " + mysql.escape(selectedCardDBID)
  var result = []
  connect.query(userIDQuery, function(err, resultUser) {
    if(err) throw err;
    var i = 0
    var idsToFind = ""
    while(resultUser[i]){
      idsToFind += "id = " + mysql.escape(resultUser[i].user_id) +  " OR "
      i++
    }
    if(idsToFind === ""){
      res.render('sellcardView', {page:'Buy a Card', 
                                    menuId:'sellCard',
                                    imageUrl: selectedCardImageUrl,
                                    mode: "BUY",
                                    cardFound: true,
                                    myCss: myCss,
                                    usersInfo: result});
    }else{
      idsToFind  = idsToFind.substring(0,  idsToFind.length - 3)
      var userInfoQuery = "SELECT * FROM user WHERE " + idsToFind
      connect.query(userInfoQuery, function(err, resultUserInfo) {
        if (err) throw err;
        var j = 0
        while(resultUserInfo[j]){
          var userInfo = {name: resultUserInfo[j].name, 
                          adress: resultUserInfo[j].adress,
                          id: resultUserInfo[j].id}
          result.push(userInfo)
          j++
        }

        res.render('sellcardView', {page:'Buy a Card', 
                                    menuId:'sellCard',
                                    imageUrl: selectedCardImageUrl,
                                    mode: "BUY",
                                    cardFound: true,
                                    myCss: myCss,
                                    usersInfo: result});
      });
    }
  });
});

router.post('/api/addCardToShop', function(req, res) {
  insertCardUser(selectedCardDBID, sessionUserId);
  myCss =  {
    style: fs.readFileSync("./css/findCardViewStyle.css", "utf8")
  }
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: selectedCardImageUrl,
                              cardFound: true,
                              myCss: myCss});
});

router.post('/api/addCardToAnnonce', function(req, res) {
  insertCardAnnonce(selectedCardDBID, sessionUserId);
  myCss =  {
    style: fs.readFileSync("./css/findCardViewStyle.css", "utf8")
  }
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: selectedCardImageUrl,
                              cardFound: true,
                              myCss: myCss});
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

  var query  =  "SELECT * FROM user WHERE id = "  + 
                "(SELECT user_id FROM card_user WHERE card_id = " + mysql.escape(cardId) + ")"

  connect.query(query, function(err, result) {
    if (err) throw err;
    console.log("FIND SELLERS")
    console.log(result)

    var i = 0;
    while(result[i]){

    }

    return result;
  });
}

function findBuyers(cardId){
  var userIDQuery = "SELECT user_id FROM annonces WHERE card_id = " + mysql.escape(cardId)
  var result = []
  connect.query(userIDQuery, function(err, resultUser) {
    if(err) throw err;
    console.log("RESULT USER ID")
    console.log(resultUser)
    var i = 0
    var idsToFind  = ""
    while(resultUser[i]){
      idsToFind += "id = " + mysql.escape(resultUser[i].user_id) +  " OR "
      i++
    }
    idsToFind  = idsToFind.substring(0,  idsToFind.length - 3)
    var userInfoQuery = "SELECT * FROM user WHERE " + idsToFind
    connect.query(userInfoQuery, function(err, resultUserInfo) {
      if (err) throw err;
      var j = 0
      while(resultUserInfo[j]){
        var userInfoStr = resultUserInfo[j].name + "/" + resultUserInfo[j].adress;
        result.push(userInfoStr)
        j++
      }
      return result
    });
  });
}

module.exports = router;
