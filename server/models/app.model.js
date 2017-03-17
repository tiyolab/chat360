var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('../config/db').db;

/**
 * @description contain the details of Attribute
 */
var App = new Schema({
	
    appName: {
        type: String,
        unique: true,
        required: true
    },
	
	appDescription: {
        type: String,
        unique: true,
    },
	
	SForgId: {
        type: String,
        required: true
    },
	
	SFconsumerKey: {
        type: String,
        unique: true,
        required: true
    },
	
	SFconsumerSecret: {
        type: String,
        unique: true,
        required: true
    },
	
	SFusername: {
        type: String,
        required: true
    },

    SFpassword: {
        type: String,
        required: true
    },
	
	FBappName: {
        type: String,
        required: true,
		unique: true,
    },
	
	FBappId: {
        type: String,
        required: true,
		unique: true,
    },
	
	FBappSecret: {
        type: String,
        required: true,
		unique: true,
    },
	
	FBpageName: {
        type: String,
        required: true,
		unique: true,
    },
	
	FBpageId: {
        type: String,
        required: true,
		unique: true,
    },
	
	FBpageAccessToken: {
        type: String,
        required: true,
		unique: true,
    },
	
	FBwebhookValidationToken: {
        type: String,
        required: true
    },
	
	owner: {
		type: String,
		required: true
	},
	
	isActive: {
		type: Boolean,
		default: false
	}
});

App.statics = {
    insertApp: function(data, callback) {
        this.create(data, callback);
    },
	
    updateApp: function(selector, data, callback) {
        this.update(selector, data, {w:1}, callback);
    },
	
	updateAppById: function(id, data, callback) {
        this.findOneAndUpdate({'_id': id}, {$set: data}, {w:1, new: true}, callback);
    },

	findApp: function(selector, callback) {
        this.find(selector, callback);
    },
	
	findActiveApp: function(callback){
		this.find({isActive: true}, callback);
	},
	
    findByOwner: function(owner, callback) {
        this.find({owner: owner}, callback);
    },

    findByIdAndAppName: function(id, appName, callback) {
        this.findOne({ appName: appName, _id: id }, callback);
    },
	
	removeApp: function(selector, callback){
		this.remove(selector, callback);
	}
}

var app = mongoose.model('app', App);

/** export schema */
module.exports = {
    App: app
};

