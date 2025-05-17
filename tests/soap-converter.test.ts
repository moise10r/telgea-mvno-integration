import { SoapConverter } from '../src/converters/soap-converter';
import { InternalNormalizedData } from '../src/interfaces/internalNormalizedData';
import { MvnoSoapChargeSmsResponse } from '../src/interfaces/mvnoSoapChargeSmsResponse';

describe('SoapConverter', () => {
  let converter: SoapConverter;
  let soapResponse: MvnoSoapChargeSmsResponse;

  beforeEach(() => {
    converter = new SoapConverter();
    soapResponse = {
      'soapenv:Envelope': {
        'soapenv:Body': {
          'sms:ChargeSMS': {
            'sms:UserID': 'test123',
            'sms:PhoneNumber': '+46701234567',
            'sms:MessageID': 'msg456',
            'sms:Timestamp': '2025-04-15T14:30:00Z',
            'sms:ChargeAmount': '0.10',
            'sms:Currency': 'EUR'
          }
        },
        'xmlns:soapenv': '',
        'xmlns:sms': ''
      }
    };
  });

  describe('convertChargeSmsToNormalizedFormat', () => {
    it('should correctly convert a SOAP response to the normalized format', () => {
      const result = converter.convertChargeSmsToNormalizedFormat(soapResponse);
      expect(result).toBeDefined();
      expect(result.telgea_user_id).toBe('test123');
      expect(result.msisdn).toBe('+46701234567');
      expect(result.sms_charges).toHaveLength(1);
      expect(result.sms_charges[0].message_id).toBe('msg456');
      expect(result.sms_charges[0].timestamp).toBe('2025-04-15T14:30:00Z');
      expect(result.sms_charges[0].amount).toBe(0.1);
      expect(result.sms_charges[0].currency).toBe('EUR');
      expect(result.billing_period).toBeDefined();
      expect(new Date(result.billing_period.start).getDate()).toBe(15);
      expect(new Date(result.billing_period.end).getMonth()).toBe(4);
      expect(new Date(result.billing_period.end).getDate()).toBe(1);
    });

    it('should merge with existing data when provided', () => {
      const existingData: Partial<InternalNormalizedData> = {
        telgea_user_id: 'test123',
        msisdn: '+46701234567',
        usage_data: {
          total_mb: 500,
          roaming_mb: 100,
          country: 'SE',
          network_type: '5G',
          provider_code: 'SE01'
        },
        sms_charges: [
          {
            message_id: 'prev789',
            timestamp: '2025-04-10T09:15:00Z',
            amount: 0.05,
            currency: 'EUR'
          }
        ],
        billing_period: {
          start: '2025-04-01T00:00:00Z',
          end: '2025-04-30T23:59:59Z'
        }
      };

      const result = converter.convertChargeSmsToNormalizedFormat(soapResponse, existingData);
      expect(result.usage_data.total_mb).toBe(500);
      expect(result.usage_data.network_type).toBe('5G');
      expect(result.sms_charges).toHaveLength(2);
      expect(result.sms_charges[0].message_id).toBe('prev789');
      expect(result.sms_charges[1].message_id).toBe('msg456');
      expect(result.billing_period.start).toBe('2025-04-01T00:00:00Z');
    });

    it('should handle the float conversion properly', () => {
      const testCases = ['0.10', '1.00', '0.05', '10.99'];
      testCases.forEach(amount => {
        const testResponse: MvnoSoapChargeSmsResponse = {
          'soapenv:Envelope': {
            'soapenv:Body': {
              'sms:ChargeSMS': {
                ...soapResponse['soapenv:Envelope']['soapenv:Body']['sms:ChargeSMS'],
                'sms:ChargeAmount': amount
              }
            },
            'xmlns:soapenv': '',
            'xmlns:sms': ''
          }
        };

        const result = converter.convertChargeSmsToNormalizedFormat(testResponse);
        expect(result.sms_charges[0].amount).toBe(parseFloat(amount));
        expect(typeof result.sms_charges[0].amount).toBe('number');
      });
    });

    it('should throw an error for malformed SOAP response', () => {
      const malformedResponse = {
        'soapenv:Envelope': {
          'soapenv:Body': {},
          'xmlns:soapenv': '',
          'xmlns:sms': ''
        }
      } as unknown as MvnoSoapChargeSmsResponse;

      expect(() => {
        converter.convertChargeSmsToNormalizedFormat(malformedResponse);
      }).toThrow(/Failed to convert SOAP response/);
    });
  });

  describe('batchConvert', () => {
    it('should process multiple SOAP responses', () => {
      const secondResponse: MvnoSoapChargeSmsResponse = {
        'soapenv:Envelope': {
          'soapenv:Body': {
            'sms:ChargeSMS': {
              'sms:UserID': 'test123',
              'sms:PhoneNumber': '+46701234567',
              'sms:MessageID': 'msg789',
              'sms:Timestamp': '2025-04-16T10:15:00Z',
              'sms:ChargeAmount': '0.15',
              'sms:Currency': 'EUR'
            }
          },
          'xmlns:soapenv': '',
          'xmlns:sms': ''
        }
      };

      const result = converter.batchConvert([soapResponse, secondResponse]);
      expect(result.sms_charges).toHaveLength(2);
      expect(result.sms_charges[0].message_id).toBe('msg456');
      expect(result.sms_charges[1].message_id).toBe('msg789');
      expect(result.sms_charges[0].amount).toBe(0.1);
      expect(result.sms_charges[1].amount).toBe(0.15);
    });

    it('should throw an error when no responses are provided', () => {
      expect(() => {
        converter.batchConvert([]);
      }).toThrow('No SOAP responses provided');
    });
  });

  describe('Date handling', () => {
    it('should set correct billing period dates', () => {
      const testDates = [
        '2025-01-15T12:00:00Z',
        '2025-02-28T12:00:00Z',
        '2025-04-01T12:00:00Z',
        '2025-04-30T12:00:00Z',
        '2025-12-25T12:00:00Z'
      ];

      testDates.forEach(date => {
        const testResponse: MvnoSoapChargeSmsResponse = {
          'soapenv:Envelope': {
            'soapenv:Body': {
              'sms:ChargeSMS': {
                ...soapResponse['soapenv:Envelope']['soapenv:Body']['sms:ChargeSMS'],
                'sms:Timestamp': date
              }
            },
            'xmlns:soapenv': '',
            'xmlns:sms': ''
          }
        };

        const result = converter.convertChargeSmsToNormalizedFormat(testResponse);
        const startDate = new Date(result.billing_period.start);
        const endDate = new Date(result.billing_period.end);

        expect(startDate.getUTCHours()).toBe(0);
        expect(startDate.getUTCMinutes()).toBe(0);
        expect(startDate.getUTCSeconds()).toBe(0);
        expect(endDate.getUTCHours()).toBe(23);
        expect(endDate.getUTCMinutes()).toBe(59);
        expect(endDate.getUTCSeconds()).toBe(59);
        expect(startDate.getUTCMonth()).toBe(new Date(date).getUTCMonth());
        expect(endDate.getUTCMonth()).toBe(new Date(date).getUTCMonth());
      });
    });
  });
});
