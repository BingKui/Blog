const express = require('express');
const router = express.Router();

const sha1 = require('sha1');

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin;
//login page
router.get('/', checkNotLogin, (req, res, next) => {
	res.render('signin');
});
//login
router.post('/', checkNotLogin, (req, res, next) => {
	let name = req.fields.name;
	let password = req.fields.password;

	UserModel.getUserInfoByName(name)
		.then((user) => {
			if (!user) {
				req.flash('error', '用户不存在');
				return res.redirect('back');
			}
			if (sha1(password) !== user.password) {
				req.flash('error', 'username or password error!');
				return res.redirect('back');
			}
			req.flash('success', 'Login Success!');
			delete user.password;
			req.session.user = user;
			res.redirect('/posts');
		})
		.catch(next);
});

module.exports = router;