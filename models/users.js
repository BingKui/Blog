var User = require('../lib/mongo').User;

module.exports = {
	// 注册一个用户
	create: (user) => {
		return User.create(user).exec();
	},
	getUserInfoByName: (name) => {
		return User
			.findOne({
				name: name
			})
			.addCreatedAt()
			.exec();
	}
};