'use strict';

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

function indexHandler (request, reply) {

    const pos = partsOfSpeech[partsOfSpeech.length * Math.random() | 0];

    Promise.all([
        model.getRandomWord(pos[0]),
        model.getRandomWord(pos[1])
    ]).then(res => {
        reply.view('index', {
            wordOne: res[0].word,
            wordOneColor: partsOfSpeechColor[pos[0]],
            wordTwo: res[1].word,
            wordTwoColor: partsOfSpeechColor[pos[1]]
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
