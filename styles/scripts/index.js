const PORT = process.env.PORT

var request = require('request');
const express = require("express");

const app = express();

app.get('/', function(req, resp) {
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Headers', 'X-Requested-With');
  
    var client_id = "b9442f79cf1d40cd8b894fe0fb6ed46b";
    var client_secret = "250450be661b49b2ab747f86b9f3c7a9";
  
    // your application requests authorization
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64')
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        resp.json({ token: body.access_token });
      }
    });
  });
  

  app.listen(PORT , function() {
    console.log("Up and running, Emi :)");
  });
