const BotResponseDefinitionModel = require('../models/bot.response.definition.model');

exports.getAllBlock = function(req, res){
	BotResponseDefinitionModel.get(req.query.appid, function(result){
		if(result){
			res.json(result);
		}else{
			res.json([]);
		}
	});
}

exports.getBlockOnly = function(req, res){
	BotResponseDefinitionModel.BlockModel.getAllBlock(req.query.appid, function(err, result){
		if(!err){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.saveBlockAndStructure = function(req, res){
	BotResponseDefinitionModel.saveBlockAndStructure(req.body.block, req.body.structure, function(err, result){
		res.json({
			err: err,
			res: result
		});
	});
}

exports.saveStructure = function(req, res){
	BotResponseDefinitionModel.BlockStructureModel.insert(req.body, function(err, result){
		if(!err){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.updateStructure = function(req, res){
	BotResponseDefinitionModel.BlockStructureModel.updateById(req.body._id, req.body, function(err, result){
		if(!err){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.removeStructure = function(req, res){
	BotResponseDefinitionModel.BlockStructureModel.removeById(req.body._id, function(err, result){
		if(!err){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.saveBlock = function(req, res){
	BotResponseDefinitionModel.saveBlock(req.body, function(err, result){
		if(result){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}

exports.updateBlock = function(req, res){
	BotResponseDefinitionModel.updateBlock(req.body, function(err, result){
		if(result){
			res.json(result);
		}else{
			res.json(false);
		}
	});
}