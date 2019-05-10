import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
const md5 = require('md5');
const axios = require('axios');
const blowson = require('blowson');
const fs = require('fs');
const urlStatusCode = require('url-status-code');

import schema from './options.json';

export default function loader(source) {
    const options = getOptions(this) || {};
    const data = require(source);

    validateOptions(schema, options, 'FakeQL Loader');
    
    let parsedData = {};
    let extendedData = '';
    let hash = '';

    // Check if data is a JSON and get the hash of it:
    try {
        parsedData = JSON.parse(data);
        hash = md5(parsedData);
    } catch(error) {
        console.error(error);
    }

    if (hash !== '' && typeof parsedData === 'object') {
        const extendedSource = source.replace('.fakeql.json', `.fakeql-${hash}.json`);

        if (fs.existsSync(extendedSource)) {
            extendedData = require(extendedSource)
        } else {
            extendedData = JSON.stringify(blowson(input));
            fs.writeFileSync(extendedSource, extendedData);
        }

        const extendedDataHash = md5(extendedData);

        // Check first if this deployment already exists:
        urlStatusCode(`https://fakeql.com/api/test.js&hash=${extendedDataHash}`, (error, statusCode) => {
            if (error || statusCode !== 200) {
                // Deploy the data:
                axios.post('https://fakeql.com/api/deploy.js', { "source": parsedData, "extended": extendedData })
                    .then(function (response) {
                        console.log('New FakeQL deployment created: https://fakeql.com/graphql/' + response.data.hash);
                        return `module.exports = '${response.data.hash}'`;
                    })
                    .catch(function (error) {
                        console.log('Deployment failed, please try again.');
                    });
            } else {
                return `module.exports = '${extendedDataHash}'`;
            }
        })
    } else {
        return 'module.exports = false';
    }
}