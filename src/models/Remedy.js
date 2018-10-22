const sql = require('mssql');
const Config = require('../config/config');

const dbconfig = Config.DB.config;

let connPoolPromise = null;

const getConnPoolPromise = () => {
	connPoolPromise = new Promise((resolve, reject) => {
		const conn = new sql.ConnectionPool(dbconfig);
		conn.on('close', () => connPoolPromise = null);
		conn.connect()
			.then(pool => resolve(pool))
			.then(pool => pool.close())
			.catch(err => {
				connPoolPromise = null;
				return reject(err);
			});
	});
	return connPoolPromise;
};

module.exports = {
	query(sqlQuery, callback) {
		getConnPoolPromise().then( (pool) => {
			const request = new sql.Request(pool);
			return request.query(sqlQuery);
		})
			.then( (result) => callback(null, result))
			.catch( (err) => callback(err));
	}

};