'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Boom = require('boom');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({
    port: 8000
});

server.register([require('vision'), require('inert')], error => {

    if (error) {
        throw error;
    }

    server.views({
        engines: {
            ejs: require('ejs')
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.route(require('./lib/routes'));

    server.start(error => {

        if (error) {
            throw error;
        }

        console.log(`server listening at ${server.info.uri}`);

    });

});
