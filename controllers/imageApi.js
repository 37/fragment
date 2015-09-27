// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var ping = require('../models/ping');

// AJAX Imagetest API post
exports.postAPI = function(data, success, failure) {
  // Build the post string from an object

  var post_data = JSON.stringify(data);

  // An object of options to indicate where to post to
  var post_options = {
      host: 'localhost',
      port: '1988',
      path: '/screenshots/post/images',
      method: 'POST',
      json: true,
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': post_data.length
      },
      success: success,
      fail: failure
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
          // IF USER FOUND LOG SIGHTING
          if(logSighting){
            // Return name of detected person
            success(chunk);
          }
      });
  });

  // post the data
  post_req.write(post_data);
  console.log('sent request');
  post_req.end();

}

function logSighting() {
  var sighting = new ping({
    email: req.body.email,
    password: req.body.password
  });


  sighting.save(function(err) {
    if (err) return next(err);
    // reflect change
    console.log('New sighting logged.');
    return true;
  });
}
