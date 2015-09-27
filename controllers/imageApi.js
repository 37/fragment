// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

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
      success: success,
      fail: failure
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  console.log('sent request');
  post_req.end();

}
