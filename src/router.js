const http = require('http');
const fs = require('fs');
const handlers = require('./handlers');

// check why we've put this here
const pg = require('pg');

const queryString = require('querystring');

const router = (req, res) => {
  const endpoint = req.url.split('/')[1];

  if (endpoint === '') {
    handlers.home(req, res);
  } else if (endpoint === 'search') {
    handlers.search(req, res); // some arguments maybe
  } else if (endpoint === 'request-item') {
    handlers.requestItem(); // some arguments
  } else if (endpoint === 'add-item') {
    handlers.addItem(); // some arguments
  } else {
    handlers.public(req, res, endpoint);
  }

}

module.exports = router;