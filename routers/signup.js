const fs = require('fs');
const sha1 = require('sha1');
const path = require('path');
const express = require('express');
const router = express.Router();


const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;
//signup page
router.get('/', checkNotLogin, (req, res, next) => {
	//res.send('hehe');
	res.render('signup');
});
//signup
router.post('/', checkNotLogin, (req, res, next) => {
	let name = req.fields.name;
	let gender = req.fields.gender;
	let bio = req.fields.bio;
	let avatar = req.files.avatar.path.split(path.sep).pop();
	let password = req.fields.password;
	let repassword = req.fields.repassword;
	//check
	try {
		if (!(name.length >= 1 && name.length <= 10)) {
			throw new Error('name length 1-10 chart!')
		}
		if (['m', 'f', 'x'].indexOf(gender) === -1) {
			throw new Error('gengder error!');
		}
		if (!(bio.length >= 1 && bio.length <= 30)) {
			throw new Error('个人简介请限制在 1-30 个字符');
		}
		if (!req.files.avatar.name) {
			throw new Error('缺少头像');
		}
		if (password.length < 6) {
			throw new Error('密码至少 6 个字符');
		}
		if (password !== repassword) {
			throw new Error('两次输入密码不一致');
		}
	} catch (e) {
		// 注册失败，异步删除上传的头像
		fs.unlink(req.files.avatar.path);
		req.flash('error', e.message);
		return res.redirect('/signup');
	}
	password = sha1(password);
	let user = {
		name: name,
		password: password,
		gengder: gender,
		bio: bio,
		avatar: avatar
	};
	UserModel.create(user).then((result) => {
		user = result.ops[0];
		delete user.password;
		req.session.user = user;
		req.flash('success', 'Register Success!');
		res.redirect('/posts');
	}).catch((e) => {
		fs.unlink(req.files.avatar.path);
		if (e.message.match('E11000 duplicate key')) {
			req.flash('error', 'User is Registered!');
			return res.redirect('signup');
		}
		next(e);
	});
});

module.exports = router;