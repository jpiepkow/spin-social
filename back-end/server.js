var Hapi = require('hapi'),
Inert = require('inert'),
Vision = require('vision'),
HapiSwagger = require('hapi-swagger'),
Pack = require('./package');
var config = require('./config/server_settings');
var routes = require('./config/routes');
var agenda = require('./lib/helpers/agenda');

GLOBAL.server = new Hapi.Server();

server.connection(config);

for (var i = 0; i < routes.length; i++) {
  server.route(routes[i]);
}
var swaggerOptions = { apiVersion: Pack.version };
server.register(
  [ Inert, Vision, { register: HapiSwagger, options: swaggerOptions } ],
  function(err) {
    server.start(function() {
     agenda.on('ready', function() {
      agenda.start();
    }); 
     function graceful() {
      agenda.stop(function() {
        process.exit(0);
      });
    }

    process.on('SIGTERM', graceful);
    process.on('SIGINT' , graceful);
    console.log('Server running at:', server.info.port);
  });
  }
  );
