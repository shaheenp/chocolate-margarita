'use strict';

const http = require('http');

function httpGet (url) {

    return new Promise((resolve, reject) => {

        http.get(url, res => {

            let data = '';

            res.setEncoding('utf8');

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    data = JSON.parse(data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });

        }).on('error', reject);

    });

}

function getRandomWord (partOfSpeech) {

    return httpGet(`http://api.wordnik.com:80/v4/words.json/randomWord?includePartOfSpeech=${partOfSpeech}&api_key=***REMOVED***`);

}

exports.getRandomWord = getRandomWord;
