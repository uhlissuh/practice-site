var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  if(req.method == 'POST') {
    console.log("the form was submitted");
    var body = '';
    req.on('data', function(data) {
    body += data;
    });
    req.on('end', function() {
      console.log("body is" + body);
      res.writeHead(301, {'location' : "index.html"});
      res.end();
    });

  } else {
    fs.readFile("index.html", function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    })
  }
});

server.listen(8080);

console.log("server running on 8080")
