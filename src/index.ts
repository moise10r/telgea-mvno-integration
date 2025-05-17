import {  RestConverter } from "./conveters/rest-converter";
import { SoapConverter } from "./conveters/soap-converter";
import restData from './mocks/mvno_rest_response.json';

const restConverter = new RestConverter();
const soapConverter = new SoapConverter()
console.log('restConverter', restConverter.convertUsageToNormalizedFormat(restData), soapConverter.convertChargeSmsToNormalizedFormat({
  'soapenv:Envelope': {
    'soapenv:Body': {
      'sms:ChargeSMS': {
        'sms:UserID': 'abc123',
        'sms:PhoneNumber': '+46701234567',
        'sms:MessageID': 'msg789',
        'sms:Timestamp': '2025-04-01T12:30:00Z',
        'sms:ChargeAmount': '0.05',
        'sms:Currency': 'EUR'
      }
    }
  }
}));

console.log('Server is running')