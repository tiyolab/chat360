var crypto = require('crypto');
var config = require('./config');

var algorithm = 'aes-256-ctr';
var privateKey = config.key.privateKey;

exports.encrypt = function(password){
	return encrypt(password);
}

exports.decrypt = function(password){
	return decrypt(password);
}

function encrypt(password){
	var chiper = crypto.createCipher(algorithm, privateKey);
	var crypted = chiper.update(password, 'utf8', 'hex');
	crypted += chiper.final('hex');
	
	return crypted;
}

function decrypt(password){
	var dechiper = crypto.createDecipher(algorithm, privateKey);
	var dec = dechiper.update(password, 'hex', 'utf8');
	dec += dechiper.final('utf8');
	
	return dec;
}