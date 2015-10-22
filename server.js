var http = require('http');
var fs = require('fs');
var queryString = require('querystring');
var mustache = require('mustache');
var pg = require('pg');
var conString = "postgres://alissa:@localhost/practice_site";

var count = 0;
var people = [];

var server = http.createServer(function(req, res) {
  if (req.method == 'POST') {
    var body = '';

    req.on('data', function(data) {
      body += data;
    });

    req.on('end', function() {
      var formData = queryString.parse(body);
      pg.connect(conString, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO people (name, sex) VALUES ($1, $2)', [formData.first_name, formData.sex], function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          console.log("success");
        });
      });
      res.writeHead(301, {'location' : "/"});
      res.end();
    });

  } else if (req.method == 'DELETE') {
      var name = req.url.slice(1, req.url.length);
      for (var i = 0; i < people.length; i++) {
        if (people[i].first_name === name) {
          people.splice(i, 1);
        }
      }
      res.writeHead(200);
      res.end();
  } else {
    fs.readFile("index.html", "utf8", function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      pg.connect(conString, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query('select * from people', function(err, result) {
          done();
          if (err) {
            return console.error('error running query', err);
          }
          var queryResult = result;
          res.end(mustache.render(data, {
            hit_count: count,
            people: result.rows
          }));
        });
      });

      count = count + 1;
    });
  }
});

server.listen(8080);

console.log("server running on 8080");
