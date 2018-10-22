const express = require('express');
const path = require('path');

// api routes
const webRouter = express.Router();

// API welcome message
webRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'));
});

// ping test
webRouter.get('/ping', (req, res) => {
    res.send(Config.App.messages.ping.text);
});

module.exports = webRouter;
