var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

//signout
router.get('/', checkLogin, function(req, res, next) {
	req.session.user = null;
	req.flash('success', 'Loginout Success!');
	res.redirect('/posts');
});

module.exports = router;