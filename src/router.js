const http = require('http');
const fs = require('fs');
const handlers = require('./handlers');

// check why we've put this here
const pg = require('pg');

const queryString = require('querystring');

const router = (request, response) => {
  const endpoint = request.url.split('/')[1];

  if (endpoint === '') {
    handlers.home();
  } else if (endpoint === 'search') {
    handlers.search(); // some arguments maybe
  } else if (endpoint === 'request-item') {
    handlers.requestItem(); // some arguments
  } else if (endpoint === 'add-item') {
    handlers.addItem(); // some arguments
  } else {
    handlers.public(); // some arguments probably needed to get the file they're requesting
  }


  // Handlers
  // Home
  // Search
  // Request item
  // Add item
  // Public
  //   - this will include css, js, all that shit


}