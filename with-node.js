
var toDelete = ['x-frame-origin']

var yourModule = function () {
  var http = require('http');
  var url = require('url');

  http.createServer(onRequest).listen(3000);

  function onRequest(client_req, client_res) {
    console.log('serve: ' + client_req.url);
    console.log(client_req);

    var options = url.parse(client_req.url);
    options.method = client_req.method;

    var proxy = http.request(options);

    client_req.pipe(proxy, {
      end: true
    })

    proxy.on('response', function(res) {
      toDelete.map(function(t){ delete res.headers[t] })
      client_res.writeHead(res.statusCode, res);
      res.pipe(client_res, {
        end: true
      })
    })
  }
}

module.exports = yourModule;

yourModule()
