import { RestConverter } from "../src/converters/rest-converter";
import { InternalNormalizedData } from "../src/interfaces/internalNormalizedData";
import { MvnoRestResponse } from "../src/interfaces/mvnoRestResponse";

describe('RestConverter', () => {
  let converter: RestConverter;
  let restResponse: MvnoRestResponse;

  beforeEach(() => {
    converter = new RestConverter();
    restResponse = {
      user_id: 'test123',
      msisdn: '+46701234567',
      usage: {
        data: {
          total_mb: 845.23,
          roaming_mb: 210.50,
          country: 'SE'
        },
        period: {
          start: '2025-04-01T00:00:00Z',
          end: '2025-04-30T23:59:59Z'
        }
      },
      network: {
        type: '4G',
        provider_code: 'SE01'
      }
    };
  });

  describe('convertUsageToNormalizedFormat', () => {
    it('should correctly convert a REST response to the normalized format', () => {
      const result = converter.convertUsageToNormalizedFormat(restResponse);

      expect(result).toBeDefined();
      expect(result.telgea_user_id).toBe('test123');
      expect(result.msisdn).toBe('+46701234567');
      
      expect(result.usage_data).toBeDefined();
      expect(result.usage_data.total_mb).toBe(845.23);
      expect(result.usage_data.roaming_mb).toBe(210.50);
      expect(result.usage_data.country).toBe('SE');
      expect(result.usage_data.network_type).toBe('4G');
      expect(result.usage_data.provider_code).toBe('SE01');
      
      expect(result.billing_period).toBeDefined();
      expect(result.billing_period.start).toBe('2025-04-01T00:00:00Z');
      expect(result.billing_period.end).toBe('2025-04-30T23:59:59Z');
      
      expect(result.sms_charges).toEqual([]);
    });

    it('should merge with existing data when provided', () => {
      // Create existing data to merge with
      const existingData: Partial<InternalNormalizedData> = {
        telgea_user_id: 'test123',
        msisdn: '+46701234567',
        usage_data: {
          total_mb: 500, 
          roaming_mb: 100, 
          country: 'NO', 
          network_type: '5G', 
          provider_code: 'NO01' 
        },
        sms_charges: [
          {
            message_id: 'msg123',
            timestamp: '2025-04-10T09:15:00Z',
            amount: 0.05,
            currency: 'EUR'
          }
        ],
        billing_period: {
          start: '2025-03-15T00:00:00Z', 
          end: '2025-05-15T23:59:59Z' 
        }
      };

      const result = converter.convertUsageToNormalizedFormat(restResponse, existingData);

      // Check that usage data is overwritten by REST response
      expect(result.usage_data.total_mb).toBe(845.23);
      expect(result.usage_data.roaming_mb).toBe(210.50);
      expect(result.usage_data.country).toBe('SE');
      expect(result.usage_data.network_type).toBe('4G');
      expect(result.usage_data.provider_code).toBe('SE01');
      
      // Check that existing SMS charges are preserved
      expect(result.sms_charges).toHaveLength(1);
      expect(result.sms_charges[0].message_id).toBe('msg123');
      
      expect(result.billing_period.start).toBe('2025-04-01T00:00:00Z');
      expect(result.billing_period.end).toBe('2025-04-30T23:59:59Z');
    });

    it('should throw an error for malformed REST response', () => {
      // Create a malformed response
      const malformedResponse = {
        user_id: 'test123',
        msisdn: '+46701234567',
      } as unknown as MvnoRestResponse;

      expect(() => {
        converter.convertUsageToNormalizedFormat(malformedResponse);
      }).toThrow(/Failed to convert REST response/);
    });
  });

});