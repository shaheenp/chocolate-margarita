'use strict';

const model = require('./model');

const partsOfSpeech = [
    ['noun', 'noun'],
    ['noun', 'verb'],
    ['adjective', 'noun']
];

function indexHandler (request, reply) {

    const pos = partsOfSpeech[partsOfSpeech.length * Math.random() | 0];

    Promise.all([
        model.getRandomWord(pos[0]),
        model.getRandomWord(pos[1])
    ]).then(res => {
        reply.view('index', {
            words: `${res[0].word} ${res[1].word}`
        });
    }).catch(error => {
        reply(Boom.badImplementation(error.message));
    });

}

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: indexHandler
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
];
