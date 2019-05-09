'use strict';

const {URL} = require('url');
let config;

try {
    config = require(`${__dirname}/../config.json`);
} catch (error) {
    throw Error('Missing required config file in root project directory: config.json');
}

if (config.protocol !== 'https' || config.protocol !== 'http') {
    config.protocol = 'http';
}

const http = require(config.protocol === 'https' ? 'https' : 'http');
const endpoint = new URL(`${config.protocol}://api.wordnik.com:80/v4/words.json/randomWord?api_key=${config.apiKey}`);

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
                } catch (error) {
                    reject(error);
                }

                if (res.statusCode !== 200) {
                    data.statusCode = res.statusCode;

                    return reject(data);
                }

                resolve(data);
            });
        }).on('error', reject);
    });
}

function getRandomWord (partOfSpeech) {
    const url = new URL(endpoint.toString());

    url.searchParams.append('includePartOfSpeech', partOfSpeech);

    return httpGet(url.toString());
}

exports.getRandomWord = getRandomWord;
