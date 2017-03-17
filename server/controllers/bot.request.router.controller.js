const BotRequestRouterModel = require('../models/bot.request.router.model').BotRequestRouter;

exports.getRouter = function(req, res){
	BotRequestRouterModel.getRouter(req.query.appid, function(err, result){
		if(!err){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.saveOneRule = function(req, res){
	BotRequestRouterModel.upsert(req.body, function(err, result){
		if(!err){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.saveManyRule = function(req, res){
	BotRequestRouterModel.upsertMany(req.body, function(err, result){
		if(result){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.deleteOneRule = function(req, res){
	BotRequestRouterModel.removeRouter(req.body._id, function(err, result){
		if(!err){
			res.json(true);
		}else{
			res.json(false);
		}
	});
}