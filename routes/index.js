var express = require('express');
const mtg = require('mtgsdk');
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
  var cardFound;
  var cardFoundImageUrl;
  console.log(cardName)

  mtg.card.where({ name: cardName})
          .then(cards => {
            console.log(cards[0].name)
            cardFound = cards[0]
            cardFoundImageUrl = cardFound.imageUrl
            console.log(cardFoundImageUrl)
            res.render('findcardView', {page:'Find a Card', 
                                        menuId:'findCard',
                                        imageUrl: cardFoundImageUrl});
  });
});

module.exports = router;
