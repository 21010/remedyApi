const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const service = require('os-service');

const config = require('./config/config');

const app = express();

app.use(cors({
	'allowedHeaders': ['x-access-token', 'Content-Type'],
	'exposedHeaders': ['x-access-token'],
	'origin': ['http://localhost:3110', 'http://itisdash'],
	'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
	'preflightContinue': false
}));

app.set('title', config.App.title);
app.set('secret', config.App.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(compression());

// api routes
app.use('/api', require('./routes/api'));

// web routes
app.use('/', express.static('view'));
app.use('/', require('./routes/web'));

switch (process.argv[2]) {
case '--add':
	service.add(config.App.name, config.App.service.options, (error) => {
		if (error) throw(error);
	});
	break;

case '--remove':
	service.remove(config.App.name, (error) => {
		if (error) throw(error)
	});
	break;

case '--run':
	service.run(() => {
		service.stop(0);
	});

	// Run service program
	app.listen(config.App.port, (error) => {
		if (error) {
			console.log(error);
			return process.exit(1);
		} else {
			console.log(`Listening on port: ${config.App.port}`);
		}
	});
	break;

case '--standalone':
	app.listen(config.App.port, (error) => {
		if (error) {
			console.log(error);
			return process.exit(1);
		} else {
			console.log(`Listening on port: ${config.App.port}`);
		}
	});
	break;
      
default:
	console.log('Use node server.js --run | --add | --remove | --standalone');
}