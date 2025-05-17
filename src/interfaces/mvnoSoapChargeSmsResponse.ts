export interface MvnoSoapChargeSmsResponse {
  'soapenv:Envelope': {
    'soapenv:Body': {
      'sms:ChargeSMS': {
        'sms:UserID': string;
        'sms:PhoneNumber': string;
        'sms:MessageID': string;
        'sms:Timestamp': string;
        'sms:ChargeAmount': string;
        'sms:Currency': string;
      };
    };
    'xmlns:soapenv': string;
    'xmlns:sms': string;
  };
}