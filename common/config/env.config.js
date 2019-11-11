module.exports = function(){
	let config = {
		dev: {
			port: 3600,
			environment: "dev",
			db_connection: {
				user: 'manuelcerda',
				host: 'localhost',
				database: 'schemas-ai',
				password: 'password',
				port: 5432,
			}
		},
		test: {
			port: 3000,
			environment: "test",
			db_connection: {
				user: 'manuelcerda',
				host: 'localhost',
				database: 'schemas-ai-test',
				password: 'password',
				port: 5432,
			}
		}
	}
	if(process.env.NODE_ENV == 'dev'){
		return config.dev;
	} else if(process.env.NODE_ENV == 'test') {
		return config.dev;
	} else {
		return config.dev;
	}
}();
