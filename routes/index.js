var express = require('express');
const mtg = require('mtgsdk');
var mysql = require('mysql')
var Request = require("request");
var fs = require('fs');

var router = express.Router();

var dbConnected = false

const connect = mysql.createConnection({
  host: "mysql-cardswap.alwaysdata.net",
  port: "3306",
  user: "cardswap",
  password: "Azerty1234!",
  database: "cardswap_card"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!dbConnected){
    connect.connect(function(err){
      dbConnected = true
      res.render('index', {page:'CARDSWAP', menuId:'home'});
    });
  }else{
    res.render('index', {page:'CARDSWAP', menuId:'home'});
  }
});

router.post('/api/login/', function(req, res) {

  //console.log(req)

  const username = req.body.username
  const password = req.body.password
  connect.query('SELECT * FROM user WHERE name = ' +  mysql.escape(username), function(err, result) {
    if(err) console.log(err)
    if(result[0].name === username && result[0].password === password){
      req.session.userName = username
      req.session.userId = result[0].id
      req.session.save()

      console.log("SESSION USER NAME: " + req.session.userName)
      console.log("SESSION USER ID: " + req.session.userId)
      res.render('homepage', {page:'Homepage', 
                              menuId:'homepage'});
    }
  });
});

router.get('/homepage', function(req, res) {
  res.render('homepage', {page:'Homepage', 
                          menuId:'homepage'});
})

router.get('/findcardView', function(req, res, next) {
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: '',
                              cardFound: false});
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
      req.session.selectedCardName = cardFound.name
      req.session.selectedCardId  = cardFound.id
      req.session.selectedCardImageUrl = cardFound.imageUrl
      req.session.selectedCardGame = "MTG"
      req.session.save()
      connect.query("SELECT * FROM card WHERE game = " + mysql.escape(req.session.selectedCardGame) + 
                                      "AND card_id = " + mysql.escape(req.session.selectedCardId), function(err, result) {
        if(err) console.log(err)
        if(!result[0]){
          var sqlQuery = "INSERT INTO card (game, name, card_id,  image_url) VALUES ?";
          var sqlValues = [[req.session.selectedCardGame, 
                            req.session.selectedCardName, 
                            req.session.selectedCardId, 
                            req.session.selectedCardImageUrl]];
          connect.query(sqlQuery,  [sqlValues], function(err, result) {
            if (err) throw err;
            req.session.selectedCardDBId = result.insertId
            req.session.save()
          });
        } else {
          req.session.selectedCardDBId = result[0].id
          req.session.save()
        }
      });
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: req.session.selectedCardImageUrl,
                                  cardFound: true});
      
    });
  } else if(optionYUGIOH){
    const request = 'https://db.ygoprodeck.com/api/v5/cardinfo.php?name=' + cardName
    Request.get(request, (error, response, body) => {
      if(error) return console.log(error);
      const cardsFound = JSON.parse(body);
      cardFound = cardsFound[0];
      req.session.selectedCardName = cardFound.name
      req.session.selectedCardId  = cardFound.id
      req.session.selectedCardImageUrl = cardFound["card_images"][0].image_url
      req.session.selectedCardGame = "YUGIOH"
      req.session.save()
      connect.query("SELECT * FROM card WHERE game = " + mysql.escape(req.session.selectedCardGame) + 
                                      "AND card_id = " + mysql.escape(req.session.selectedCardId), function(err, result) {
        if(err) console.log(err)
        if(!result[0]){
          var sqlQuery = "INSERT INTO card (game, name, card_id, image_url) VALUES ?";
          var sqlValues = [[req.session.selectedCardGame, 
                            req.session.selectedCardName, 
                            req.session.selectedCardId, 
                            req.session.selectedCardImageUrl]];
          connect.query(sqlQuery, [sqlValues], function(err, result) {
            if (err) throw err;
            req.session.selectedCardDBId = result.insertId
            req.session.save()
          });
        } else {
          req.session.selectedCardDBId = result[0].id
          req.session.save()
        }
      });
      res.render('findcardView', {page:'Find a Card', 
                                  menuId:'findCard',
                                  imageUrl: req.session.selectedCardImageUrl,
                                  cardFound: true});
    });
  } else{}
});

router.post('/api/sellCard/', function(req, res) {

  var userIDQuery = "SELECT user_id FROM annonces WHERE card_id = " + mysql.escape(req.session.selectedCardDBId)
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
                            imageUrl: req.session.selectedCardImageUrl,
                            mode: "SELL",
                            cardFound: true,
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
                                    imageUrl: req.session.selectedCardImageUrl,
                                    mode: "SELL",
                                    cardFound: true,
                                    usersInfo: result});
      });
    }
  });
});

router.post('/api/buyCard/', function(req, res) {
  var userIDQuery = "SELECT user_id FROM card_user WHERE card_id = " + mysql.escape(req.session.selectedCardDBId)
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
                                    imageUrl: req.session.selectedCardImageUrl,
                                    mode: "BUY",
                                    cardFound: true,
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
                                    imageUrl: req.session.selectedCardImageUrl,
                                    mode: "BUY",
                                    cardFound: true,
                                    usersInfo: result});
      });
    }
  });
});

router.post('/api/addCardToShop', function(req, res) {
  insertCardUser(req.session.selectedCardDBId, req.session.userId);
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: req.session.selectedCardImageUrl,
                              cardFound: true});
});

router.post('/api/addCardToAnnonce', function(req, res) {
  insertCardAnnonce(req.session.selectedCardDBId, req.session.userId);
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: req.session.selectedCardImageUrl,
                              cardFound: true});
});


function insertCard(name, id, imageUrl, game){
  connect.query("SELECT * FROM card WHERE game = " + mysql.escape(game) + 
                                  "AND card_id = " + mysql.escape(id), function(err, result) {
    if(err) console.log(err)
    if(!result[0]){
      var sqlQuery = "INSERT INTO card (game, name, card_id,  image_url) VALUES ?";
      var sqlValues = [[game, name, id, imageUrl]];
      connect.query(sqlQuery,  [sqlValues], function(err, result) {
        if (err) throw err;
        req.session.selectedCardDBId = result.insertId
        req.session.save()
      });
    } else {
      req.session.selectedCardDBId = result[0].id
      req.session.save()
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
