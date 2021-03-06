import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import md5 from 'md5';
import axios from 'axios';
import urlStatusCode from 'url-status-code';

const schema = {
    "type": "object",
    "additionalProperties": false
};

export default function loader(source) {
    let callback = this.async();
    const options = getOptions(this) || {};
    validateOptions(schema, options, 'FakeQL Loader');
    
    let hash = '';
    let parsedData = {};

    // Check if data is a JSON and get the hash of it:
    try {
        if (typeof source === 'string') {
            parsedData = JSON.parse(source);
        } else {
            parsedData = source;
        }
        hash = md5(JSON.stringify(parsedData));
    } catch(error) {
        console.log(error);
        callback(null, 'export default false');
    }

    if (hash !== '' && typeof parsedData === 'object') {
        // Check first if this deployment already exists:
        console.log(`https://fakeql.com/test/${hash}`);
        urlStatusCode(`https://fakeql.com/test/${hash}`, (error, statusCode) => {
            console.log(statusCode);
            if (error || statusCode !== 200) {
                // Deploy the data:
                axios.post('https://fakeql.com/api/deploy.js', { "source": {}, "extended": parsedData })
                    .then(function (response) {
                        console.log('New FakeQL deployment created: https://fakeql.com/graphql/' + response.data.hash);
                        callback(null, `export default "${response.data.hash}"`);
                    })
                    .catch(function (error) {
                        console.log('Deployment failed');
                        callback(null, 'export default false');
                    });
            } else {
                console.log('FakeQL: Deployment found');
                callback(null, `export default "${hash}"`);
            }
        })
    } else {
        console.log('FakeQL error: No hash or valid JSON');
        callback(null, 'export default false');
    }
}