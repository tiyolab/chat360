var mongoose = require('mongoose'),
Schema = mongoose.Schema,
db = require('../config/db').db;

var BotRequestRouter = new Schema({
	appId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	
	request: {
		type: [],
		required: true
	},
	
	response: {
		type: [],
		required: true
	}
});

BotRequestRouter.statics = {
	insert : function(data, callback){
		this.create(data, callback);
	},
	
	getRouter: function(appId, callback){
		this.find({appId: appId}, callback);
	},
	
	updateRouter: function(data, callback){
		this.findOneAndUpdate({_id: data._id}, data, callback);
	},
	
	removeRouter: function(id, callback){
		this.remove({_id: id}, callback);
	},
	
	upsert: function(data, callback){
		this.findOneAndUpdate({_id: data._id ? data._id : new mongoose.mongo.ObjectID()}, {$set: data}, {w:1, new: true, upsert: true}, callback);
	},
	
	upsertMany: function(data, callback){
		var dataLength = data.length;
		var dataToReturn = [];
		var errToReturn = [];
		var that = this;
		
		data.forEach(function(d){
			that.findOneAndUpdate({_id: d._id ? d._id : new mongoose.mongo.ObjectID()}, {$set: d}, {w:1, new: true, upsert: true}, function(err, result){
				if(result){
					dataToReturn.push(result);
				}else{
					errToReturn.push(err);
				}
				
				dataLength--;
				if(dataLength == 0){
					callback(errToReturn, dataToReturn);
				}
			});
		});
	}
}

var botRequestRouter = mongoose.model('bot_request_router', BotRequestRouter);

exports.BotRequestRouter = botRequestRouter;
