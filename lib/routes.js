'use strict';

const Boom = require('@hapi/boom');
const model = require('./model');

const partsOfSpeech = [
    ['noun', 'noun'],
    ['noun', 'verb'],
    ['adjective', 'noun']
];

const partsOfSpeechColor = {
    noun: '#f00',
    verb: '#ff7a00',
    adjective: '#a100ff'
};

function indexHandler (request, h) {
    const pos = partsOfSpeech[Math.round((partsOfSpeech.length - 1) * Math.random())];

    return Promise.all([
        model.getRandomWord(pos[0]),
        model.getRandomWord(pos[1])
    ]).then(res => {
        return h.view('index', {
            wordOne: res[0].word,
            wordOneColor: partsOfSpeechColor[pos[0]],
            wordTwo: res[1].word,
            wordTwoColor: partsOfSpeechColor[pos[1]]
        });
    }).catch(error => {
        let boomError = Boom.badImplementation(error.message);

        if (error.statusCode === 429) {
            boomError = Boom.tooManyRequests(error.message);
        }

        throw boomError;
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
