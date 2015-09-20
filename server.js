var http = require('http');
var fs = require('fs');
var queryString = require('querystring');
var mustache = require('mustache');
var count = 0;

var server = http.createServer(function(req, res) {
  if(req.method == 'POST') {
    console.log("the form was submitted");
    var body = '';
    req.on('data', function(data) {
    body += data;
    });
    req.on('end', function() {
      var formData = queryString.parse(body);
      console.log(formData);
      res.writeHead(301, {'location' : "/"});
      res.end();
    });

  } else {
    fs.readFile("index.html", "utf8", function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(mustache.render(data, {hit_count : count}));
      count = count + 1;
    });
  }
});

server.listen(8080);

console.log("server running on 8080")
