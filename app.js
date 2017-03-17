const Express = require('express');
const Session = require('client-sessions');
const BodyParser = require('body-parser');
const Path = require('path');

const config = require('./server/config/config');
const db = require('./server/config/db');
const userRouter = require('./server/user.router').router;
const dashboardRouter = require('./server/dashboard.router').requestRoute;

const app = Express();

app.set('port', process.env.PORT || config.server.port);
app.set('view engine', 'ejs');

app.use(Session({
	cookieName: 'session',
	secret: config.key.privateKey,
	duration: 1000 * 60 * 60, //1 hour
	activeDuration: 1000 * 60 * 30 //30 minutes
}));
app.use(BodyParser.urlencoded({extended: true}));
app.use(BodyParser.json());
app.use(Express.static(Path.join(__dirname, 'client/')));
app.use(userRouter, dashboardRouter);

app.listen(app.get('port'), function(){
	console.log('server starting in ' + app.get('port'));
});