var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');
var messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.redirect('sign-up');
  res.render('index', {user: req.user});
});

router.get('/sign-up', userController.sign_up_get);
router.post('/sign-up', userController.sign_up_post);
router.get('/log-in', userController.log_in_get);
router.post('/log-in', userController.log_in_post);
router.get('/membership', userController.membership_get);
router.post('/membership', userController.membership_post);
router.get('/admin', userController.admin_get);
router.post('/admin', userController.admin_post);
router.get('/log-out', userController.log_out);
router.get('/new-message', messageController.new_message_get);
router.post('/new-message', messageController.new_message_post);

module.exports = router;
