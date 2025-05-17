import {  MvnoIntegrationService } from "./services/mvno.service";
import restData from './mocks/mvno_rest_response.json';
import { parseXML } from "./utils/xmlParser";
import { MvnoSoapChargeSmsResponse } from "./interfaces/mvnoSoapChargeSmsResponse";
import fs from 'fs';


function main () {
  try {
    console.log('Starting MVNO API integration...');
    const soapXML = fs.readFileSync('./src/mocks/mvno_soap_spec.xml', 'utf-8');
    const soapResponse = parseXML<MvnoSoapChargeSmsResponse>(soapXML);
    const mvnoIntegrationService = new MvnoIntegrationService();
    const combinedData = mvnoIntegrationService.processUserData(soapResponse,restData)
    console.log('\n1. Processing combined data from both sources:');
    console.log(JSON.stringify(combinedData, null, 2));
    
    console.log('\nMVNO API integration completed successfully.');
  
  } catch (error) {
    console.error('Error in MVNO integration :', error);
  }

}

main();
