const express = require('express');
const router = express.Router();

const PostModel = require('../models/posts');
const checkLogin = require('../middlewares/check').checkLogin;

router.get('/', (req, res, next) => {
	var author = req.query.author;

	PostModel.getPosts(author)
		.then((posts) => {
			res.render('posts', {
				posts: posts
			})
		})
		.catch(next);
});
//send a article
router.post('/', checkLogin, (req, res, next) => {
	let author = req.session.user._id;
	let title = req.fields.title;
	let content = req.fields.content;
	try {
		if (!title.length) {
			throw new Error('no title');
		}
		if (!content.length) {
			throw new Error('no content');
		}
	} catch (e) {
		req.flash('error', e.message);
		return res.redirect('back');
	}
	let post = {
		author: author,
		title: title,
		content: content,
		pv: 0
	};
	PostModel.create(post)
		.then((result) => {
			post = result.ops[0];
			req.flash('success', 'Success!');
			console.log(post._id);
			res.redirect(`/posts/${post._id}`);
		}).catch(next);
});
//create a article page
router.get('/create', checkLogin, (req, res, next) => {
	res.render('create');
});
//article page by ID
router.get('/:postId', (req, res, next) => {
	var postId = req.params.postId;

	Promise.all([PostModel.getPostById(postId),
			PostModel.incPv(postId)
		])
		.then((result) => {
			let post = result[0];
			if (!post) throw new Error('No article');
			res.render('post', {
				post: post
			});
		})
		.catch(next);
});
//update article page
router.get('/:postId/edit', checkLogin, (req, res, next) => {
	let postId = req.params.postId;
	let author = req.session.user._id;

	PostModel.getRawPostById(postId)
		.then((post) => {
			if (!post) throw new Error('This article is not find!');
			if (author.toString() !== post.author._id.toString()) throw new Error('You haven\'t power!');
			res.render('edit', {
				post: post
			});
		})
		.catch(next);
});
//update article by ID
router.post('/:postId/edit', checkLogin, (req, res, next) => {
	let postId = req.params.postId;
	let author = req.session.user._id;
	let title = req.fields.title;
	var content = req.fields.content;

	PostModel.updatePostById(postId, author, {
			title: title,
			content: content
		})
		.then(() => {
			req.flash('success', 'Update article success!');
			res.redirect(`/posts/${postId}`);
		})
		.catch(next);
});
//delete article
router.get('/:postId/remove', checkLogin, (req, res, next) => {
	let postId = req.params.postId;
	let author = req.session.user._id;

	PostModel.delPostById(postId, author)
		.then(() => {
			req.flash('success', 'Delete success!');
			res.redirect('/posts');
		})
		.catch(next);
});
//add a message
router.post('/:postId/comment', checkLogin, (req, res, next) => {
	res.send(req.flash());
});
//delete a message
router.post('/:postId/comment/:commentId/remove', checkLogin, (req, res, next) => {
	res.send(req.flash());
});

module.exports = router;