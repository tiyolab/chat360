const AppController = require('./controllers/app.controller');
const BotResponseDefinitionController = require('./controllers/bot.response.definition.controller');
const BotRequestRouterController = require('./controllers/bot.request.router.controller');
const Path = require('path');
const Express = require('express');

const route = Express.Router();

route.get('/dashboard', function(req, res){
	res.render(Path.resolve('client/dashboard.ejs'),{
		user: req.user
	});
});
route.get('/get/app', AppController.getApp);
route.get('/get/block/structure', BotResponseDefinitionController.getAllBlock);
route.get('/get/block', BotResponseDefinitionController.getBlockOnly);
route.get('/get/bot/router', BotRequestRouterController.getRouter);

route.post('/new/app', AppController.insertApp);
route.post('/update/app', AppController.updateApp);
route.post('/activate/app', AppController.activateApp);
route.post('/deactivate/app', AppController.deactivateApp);

route.post('/save/block/structure', BotResponseDefinitionController.saveBlockAndStructure);
route.post('/save/structure', BotResponseDefinitionController.saveStructure);
route.post('/update/structure', BotResponseDefinitionController.updateStructure);
route.post('/remove/structure', BotResponseDefinitionController.removeStructure);
route.post('/save/block', BotResponseDefinitionController.saveBlock);
route.post('/update/block', BotResponseDefinitionController.updateBlock);

route.post('/save/rule', BotRequestRouterController.saveOneRule);
route.post('/delete/rule', BotRequestRouterController.deleteOneRule);
route.post('/save/all/rule', BotRequestRouterController.saveManyRule);

exports.requestRoute = route;