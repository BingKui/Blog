module.exports = (app) => {
	app.get('/', (req, res) => {
		res.redirect('/posts'); //skip to posts page
	});
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/posts', require('./posts'));
	app.use((req, res) => {
		if (!res.headersSent) {
			res.status(404).render('404');
		}
	});
}