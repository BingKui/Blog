const marked = require('marked');
const Post = require('../lib/mongo').Post;
const CommentModel = require('./comments');
Post.plugin('contentToHtml', {
	afterFind: (posts) => {
		return posts.map((post) => {
			post.content = marked(post.content);
			return post;
		});
	},
	afterFindOne: (post) => {
		if (post) {
			post.content = marked(post.content);
		}
		return post;
	}
});
Post.plugin('addCommentsCount', {
	afterFind: function(posts) {
		return Promise.all(posts.map(function(post) {
			return CommentModel.getCommentsCount(post._id).then(function(commentsCount) {
				post.commentsCount = commentsCount;
				return post;
			});
		}));
	},
	afterFindOne: function(post) {
		if (post) {
			return CommentModel.getCommentsCount(post._id).then(function(count) {
				post.commentsCount = count;
				return post;
			});
		}
		return post;
	}
});

module.exports = {
	create: (post) => {
		return Post.create(post).exec();
	},
	getPostById: (postId) => {
		return Post
			.findOne({
				_id: postId
			})
			.populate({
				path: 'author',
				model: 'User'
			})
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	getPosts: (author) => {
		let query = {};
		if (author) {
			query.author = author;
		}
		return Post
			.find(query)
			.populate({
				path: 'author',
				model: 'User'
			})
			.sort({
				_id: -1
			})
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	incPv: (postId) => {
		return Post
			.update({
				_id: postId
			}, {
				$inc: {
					pv: 1
				}
			})
			.exec();
	},
	getRawPostById: (postId) => {
		return Post
			.findOne({
				_id: postId
			})
			.populate({
				path: 'author',
				model: 'User'
			})
			.exec();
	},
	updatePostById: (postId, author, data) => {
		return Post.update({
			author: author,
			_id: postId
		}, {
			$set: data
		}).exec();
	},
	delPostById: (postId, author) => {
		return Post.remove({
			author: author,
			_id: postId
		}).exec();
	}

}