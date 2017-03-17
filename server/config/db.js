const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.database.url, function(err){
	if(err){
		console.log('db connection error');
		return;
	}
});
const db = mongoose.connection;

db.on('error', function(err){
	console.log('db event error:');
	console.log(err);
});

db.once('open', function callback(){
	console.log('db connected')
});

exports.db = db;