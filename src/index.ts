import {  MvnoIntegrationService } from "./services/mvno.service";
import restData from './mocks/mvno_rest_response.json';
import { parseXML } from "./utils/xmlParser";
import { MvnoSoapChargeSmsResponse } from "./interfaces/mvnoSoapChargeSmsResponse";
import fs from 'fs';

const soapXML = fs.readFileSync('./src/mocks/mvno_soap_spec.xml', 'utf-8');
const soapResponse = parseXML<MvnoSoapChargeSmsResponse>(soapXML);
const mvnoIntegrationService = new MvnoIntegrationService();
console.log('restConverter', mvnoIntegrationService.processUserData(soapResponse,restData));



console.log('Server is running')