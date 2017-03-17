const Common = require('../config/common')
const Config = require('../config/config')
const Jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model').User
const privateKey = Config.key.privateKey;
const moment = require('moment');

exports.auth = function(req, res, next){
	if(req.session && req.session.access_token){
		var decoded = Jwt.verify(req.session.access_token, privateKey);
		if(decoded){
			//is token expired
			if(decoded.exp <= Date.now()){
				res.redirect('/account');
			}else{
				//verify
				UserModel.findUserByIdAndUserName(decoded.id, decoded.username, function(err, user){
					if(!err){
						req.user = user;
						next();
					}else{
						res.redirect('/account');
					}
				});
			}
		}else{
			res.redirect('/account');
		}
	}else{
		res.redirect('/account');
	}
}

exports.create = function (req, res){
	req.body.password = Common.encrypt(req.body.password);
	UserModel.saveUser(req.body, function(err, user) {
	    if(!err){
			var expires = moment().add(30, 'days').valueOf();
			var tokenData = {
				exp: expires,
				id: user._id,
				username: user.username
			}
			
			req.session.access_token = Jwt.sign(tokenData, privateKey);
			res.redirect('/dashboard');
		}
	})
}

exports.login = function (req, res){
	UserModel.findUser(req.body.username, function(err, user) {
		if(!err){
			if(user == null){
				res.send('Invalid username or password');
			}else{
				if(req.body.password === Common.decrypt(user.password)){
					var expires = moment().add(30, 'days').valueOf();
					var tokenData = {
						exp: expires,
						id: user._id,
						username: user.username
					}
					
					req.session.access_token = Jwt.sign(tokenData, privateKey);
					res.redirect('/dashboard');
				}else{
					res.send('Invalid username or password');
				}
			}
		}else{
			res.send('login failed');
		}
    });
}
