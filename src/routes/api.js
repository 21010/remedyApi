const express = require('express');
const Remedy  = require('../models/Remedy');
const Queries = require('../models/Queries');
const config = require('../config/config');

// api routes
const apiRouter = express.Router();

apiRouter.use( (req, res, next) => {
	const token = req.headers.token || req.query.token || req.body.token || req.headers['x-access-token'];
	const tokens = config.App.secret;
	if ( token && tokens.includes(token) ) {
		next();
	} else {
		return res.status(401).json({
			response: 'Access Denied. Please provide valid token.'
		});
	}
});

// Remedy SQL queries with single parameter
apiRouter.post('/:query', (req, res) => {
	const data = getRequestData(req);
	const queryName = req.params.query;
	if (queryName in Queries) {
		const sql = Queries[queryName](data);
		if (sql.status === false) return res.status(400).json({ response: sql.message });
		Remedy.query(sql.query, (err, response) => {
			if (err) return res.status(500).json({ response: err });
			res.status(200).json({ response: response.recordset });
		});
	} else {
		res.status(501).json({ response: 'Error. API does not handle provided query.' });
	}
});

module.exports = apiRouter;

function getRequestData(req) {
	return req.headers.data || req.body.data || req.query.data || req.headers['x-access-data'];
}