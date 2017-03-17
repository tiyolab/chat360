var mongoose = require('mongoose'),
Schema = mongoose.Schema,
db = require('../config/db').db;

var BlockModel =  new Schema({
	appId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	
	blockName: {
		type: String,
		required: true,
		unique: true
	}
});

var BlockStructureModel = new Schema({
	blockId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	
	type: {
		type: String,
		require: true
	},
	
	payload: {
		type: Schema.Types.Mixed,
		require: true
	}
});

BlockModel.statics = {
	insertBlock: function(data, callback){
		this.create(data, callback);
	},
	
	getAllBlock: function(appId, callback){
		this.find({appId: appId}, callback);
	},
	
	getBlockById: function(id, callback){
		this.findOne({_id: id}, callback);
	},
	
	updateBlockById: function(id, data, callback){
		this.update({_id: id}, {$set: data}, {w:1}, callback);
	},
	
	removeBlockById: function(id, callback){
		this.remove({_id: id}, callback);
	}
}

BlockStructureModel.statics = {
	insert: function(data, callback){
		this.create(data, callback);
	},
	
	getAll: function(blockId, callback){
		this.find({blockId: blockId}, callback);
	},
	
	getById: function(id, callback){
		this.findOne({_id: id}, callback);
	},
	
	updateById: function(id, data, callback){
		this.update({_id: id}, {$set: data}, {w:1}, callback);
	},
	
	upsert: function(data, callback){
		var tmpRes = [];
		var tmpErr = [];
		var count = data.length;
		var that = this;
		
		data.forEach(function(d){
			if(d._id){
				that.update({_id: d._id}, {$set: d}, {w:1}, function(err, res){
					if(!err){
						tmpRes.push(d);
					}else{
						tmpErr.push(err);
					}
					
					count--;
					if(count == 0){
						callback(tmpErr, tmpRes);
					}
				});
			}else{
				that.insert(d, function(err, res){
					if(!err){
						tmpRes.push(res);
					}else{
						tmpErr.push(err);
					}
					
					count--;
					if(count == 0){
						callback(tmpErr, tmpRes);
					}
				});
			}
		});
	},
	
	removeById: function(id, callback){
		this.remove({_id: id}, callback);
	},
	
	removeByBlockId: function(blockId, callback){
		this.remove({blockId: blockId}, callback);
	}
}

var block = mongoose.model('block', BlockModel);
var blockStructure = mongoose.model('block_structure', BlockStructureModel);

exports.BlockModel = block;
exports.BlockStructureModel = blockStructure;
exports.get = function(appId, outerCbk){
	block.getAllBlock(appId, function(err1, res1){
		if(!err1){
			var tmpData = [];
			var length = res1.length;
			
			if(length == 0){
				return outerCbk(tmpData);
			}
			
			//iterate trought block
			res1.forEach(function(b, index){
				tmpData[index] = {};
				tmpData[index]._id = b._id;
				tmpData[index].appId = b.appId;
				tmpData[index].blockName = b.blockName;
				tmpData[index].blockStructures = [];
				
				//get each blockStructure of block
				blockStructure.getAll(b._id, function(err2, res2){
					length--;
					res2.forEach(function(s){
						tmpData[index].blockStructures.push(s);
					});
					
					if(length == 0){
						outerCbk(tmpData);
					}
				});
			});
		}else{
			return outerCbk([]);
		}
	});
}

exports.saveBlockAndStructure = function(blockData, structure, callback){
	block.insertBlock(blockData, function(err1, res1){
		if(!err1){
			structure.blockId = res1._id;
			blockStructure.insert(structure, function(err2, res2){
				if(!err2){
					callback(err2, {
						block: res1,
						structure: res2
					});
				}else{
					callback("err_save_structure", {
						block: res1
					});
				}
			});
		}else{
			callback("err_save_block", null);
		}
	});
}

exports.saveBlock = function(data, callback){
	block.insertBlock(getBlockOnly(data), function(err1, res1){
		if(!err1){
			var tmp = [];
			
			data.blockStructures.forEach(function(s){
				s.blockId = res1._id;
				tmp.push(s);
			});
			
			if(tmp.length > 0){
				blockStructure.upsert(tmp, function(err2, res2){
					if(res2){
						callback(err2, responseBlock(res1, res2));
					}else{
						callback(err2, responseBlock(res1, []));
					}
				});
			}else{
				callback(err1, responseBlock(res1, []));
			}
		}else{
			callback(err1, res1);
		}
	});
}

exports.updateBlock = function(data, callback){
	block.updateBlockById(data._id, getBlockOnly(data), function(err1, res1){
		if(!err1){
			var tmp = [];
			
			data.blockStructures.forEach(function(s){
				if(!s.blockId)
					s.blockId = data._id;
				tmp.push(s);
			});
			
			if(tmp.length > 0){
				blockStructure.upsert(tmp, function(err2, res2){
					if(res2){
						callback(err2, responseBlock(data, res2));
					}else{
						callback(err2, responseBlock(data, []));
					}
				});
			}else{
				callback(err1, responseBlock(data, []));
			}
		}else{
			callback(err1, res1);
		}
	});
}

function responseBlock(block, blockStructures){
	return {
			appId: block.appId,
			blockName: block.blockName,
			_id: block._id,
			blockStructures: blockStructures ? blockStructures : []
		}
}

function getBlockOnly(block){
	var tmp = {};
	if(block.appId) tmp.appId = block.appId;
	if(block.blockName) tmp.blockName = block.blockName;
	if(block._id) tmp._id = block._id;
	
	return tmp;
}