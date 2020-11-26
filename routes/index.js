var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('sign-up');
  // res.render('index', { title: 'Express' });
});

router.get('/sign-up', userController.sign_up_get);
router.post('/sign-up', userController.sign_up_post);

module.exports = router;
