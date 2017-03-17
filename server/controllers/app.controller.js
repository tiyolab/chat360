const AppModel = require('../models/app.model').App;
const WebhookController = require('../controllers/webhook.controller');

exports.insertApp = function(req, res){
	var data = req.body;
	data.owner = req.user._id;
	
	AppModel.insertApp(data, function(err, result){
		if(!err){
			res.json({
				status: "success"
			});
		}else{
			res.json({
				status: "failed"
			});
		}
	});
}

exports.updateApp = function(req, res){
	var data = req.body;
	data.owner = req.user._id;
	
	AppModel.updateAppById(data._id, data, function(err, result){
		if(!err){
			res.json({
				status: "success"
			});
		}else{
			res.json({
				status: "failed"
			});
		}
	});
}

exports.getApp = function(req, res){
	AppModel.findByOwner(req.user._id, function(err, result){
		if(!err){
			res.json(result);
		}else{
			res.json([]);
		}
	});
}

exports.activateApp = function(req, res){
	
	AppModel.updateAppById(req.body._id, {isActive: true}, function(err, result){
		if(!err){
			WebhookController.activeApps.push(result);
			WebhookController.activeMapApps[result.FBpageId] = result;
			
			console.log('active app');
			console.log(WebhookController.activeApps);
			console.log(WebhookController.activeMapApps);
			res.json(true);
		}else{
			res.json(false);
		}
	});
}

exports.deactivateApp = function(req, res){
	AppModel.updateAppById(req.body._id, {isActive: false}, function(err, result){
		if(!err){
			delete WebhookController.activeMapApps[result.FBpageId];
			WebhookController.activeApps = WebhookController.activeApps.filter(function(a){
				if(a._id == req.body._id){
					return false;
				}
				return true;
			});
			
			console.log('active app');
			console.log(WebhookController.activeApps);
			console.log(WebhookController.activeMapApps);
			res.json(true);
		}else{
			res.json(false);
		}
	});
}