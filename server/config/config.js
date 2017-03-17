module.exports = {
	server: {
		//host: 'localhost',
		//port: 1107
		host: 'chat360.herokuapp.com',
		port: 1107
	},
	database: {
		host: 'ds145848.mlab.com',
		port: 45848,
		db: 'chat360',
		url: 'mongodb://chat360:Jakarta12345@ds145848.mlab.com:45848/chat360'
		//host: 'localhost',
        //port: 27017,
        //db: 'chat360',
        //url: 'mongodb://127.0.0.1:27017/chat360'
	},
	key: {
		privateKey: '31EC6C34367E062FF180C80F93409FFF',
		tokenExpiry: 1 * 30 * 1000  * 60 //1 hour
	}
}