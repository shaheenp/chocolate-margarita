'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Boom = require('boom');
const model = require('./lib/model');

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

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, reply) => {

                model.getRandomWord('noun').then(wordOneJSON => {

                    let words = wordOneJSON.word;

                    return model.getRandomWord('noun').then(wordTwoJSON => {

                        words += ' ' + wordTwoJSON.word;

                        reply.view('index', {words});

                    });

                }).catch(error => {
                    reply(Boom.badImplementation(error.message));
                });

            }
        },
        {
            method: '*',
            path: '/public/{path*}',
            handler: {
                directory: {
                    path: '.',
                    redirectToSlash: true
                }
            }
        }
    ]);

    server.start(error => {

        if (error) {
            throw error;
        }

        console.log(`server listening at ${server.info.uri}`);

    });

});
