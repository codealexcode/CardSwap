var express = require('express');
const mtg = require('mtgsdk');
const https = require('https');
var Request = require("request");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

router.get('/findcardView', function(req, res, next) {
  res.render('findcardView', {page:'Find a Card', 
                              menuId:'findCard',
                              imageUrl: 'some url'});
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
