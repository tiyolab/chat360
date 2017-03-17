const UserController = require('./controllers/user.controller');
const Path = require('path');
const Express = require('express');
const route = Express.Router();

route.post('/login', UserController.login);
route.post('/create_account', UserController.create);
route.post('*', UserController.auth);
	
route.get('/account', function(req, res){res.render(Path.resolve('client/account.ejs'))});
route.get('*', UserController.auth);



exports.router = route;