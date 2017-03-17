const AppModel = require('../models/app.model').App;

exports.activeApps = [];
exports.activeMapApps = {};

AppModel.findActiveApp(function(err, result){
	if(result){
		result.forEach(function(a, index){
			exports.activeApps.push(a);
			exports.activeMapApps[a.FBpageId] = a;
		});
	}
});

exports.get = function(req, res){
	if (req.query['hub.mode'] === 'subscribe' && validateVerifyToken(req.query['hub.verify_token'])) {
		console.log("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);          
	}
}

function validateVerifyToken(x){
	var isExists = false;
	exports.activeApp.some(function(a){
		if(a.FBwebhookValidationToken === x){
			isExists = true;
			return true;
		}
	});
	
	return isExists;
}
