module.exports = {
	checkLogin: (req, res, next) => {
		if (!req.session.user) {
			req.flash('error', 'No Login!');
			return res.redirect('/signin');
		}
		next();
	},
	checkNotLogin: (req, res, next) => {
		if (req.session.user) {
			req.flash('error', 'Logined!');
			return res.redirect('back'); //back before page
		}
		next();
	}
}