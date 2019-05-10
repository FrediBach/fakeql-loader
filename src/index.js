import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import schema from './options.json';

export default function loader(source) {
    const options = getOptions(this) || {};

    validateOptions(schema, options, 'FakeQL Loader');

    let hash;

    return `module.exports = '${hash}'`;
}