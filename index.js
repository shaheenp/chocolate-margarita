'use strict';

const Path = require('path');
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

const server = new Hapi.Server({
    port: 4000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

async function startServer () {
    await server.register([require('@hapi/vision'), require('@hapi/inert')]);

    server.route(require('./lib/routes'));

    server.views({
        engines: {
            ejs: require('ejs')
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.ext('onPreResponse', (request, h) => {
        const {response} = request;

        if (!response.isBoom) {
            return h.continue;
        }

        return h.view('error', {
            message: response.output.payload.error
        }).code(response.output.statusCode);
    });

    await server.start();

    console.log(`server listening at ${server.info.uri}`);
}

startServer();
