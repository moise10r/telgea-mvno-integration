import {  RestConverter } from "./conveters/rest-converter";
import restData from './mocks/mvno_rest_response.json';

const restConverter = new RestConverter();
console.log('restConverter', restConverter.convertUsageToNormalizedFormat(restData));

console.log('Server is running')