
import { RestConverter } from '../converters/rest-converter';
import { SoapConverter } from '../converters/soap-converter';
import { InternalNormalizedData } from '../interfaces/internalNormalizedData';
import { MvnoRestResponse } from '../interfaces/MvnoRestResponse';
import { MvnoSoapChargeSmsResponse } from '../interfaces/mvnoSoapChargeSmsResponse';

/**
 * Service for integrating and combining data from multiple MVNO API sources
 */
export class MvnoIntegrationService {
  private soapConverter: SoapConverter;
  private restConverter: RestConverter;

  constructor() {
    this.soapConverter = new SoapConverter();
    this.restConverter = new RestConverter();
  }

  /**
   * Processes data from both SOAP and REST APIs to create a complete normalized data object
   * 
   * @param soapResponse - SOAP API response with SMS charge data
   * @param restResponse - REST API response with usage data
   * @returns Combined normalized data
   */
  public processUserData(
    soapResponse: MvnoSoapChargeSmsResponse,
    restResponse: MvnoRestResponse
  ): InternalNormalizedData {
    try {
      // Validate that both responses are for the same user
      const soapUserId = soapResponse['soapenv:Envelope']['soapenv:Body']['sms:ChargeSMS']['sms:UserID'];
      const restUserId = restResponse.user_id;

      if (soapUserId !== restUserId) {
        throw new Error(`User ID mismatch: SOAP (${soapUserId}) vs REST (${restUserId})`);
      }

      // Convert REST response first 
      const normalizedData = this.restConverter.convertUsageToNormalizedFormat(restResponse);
      
      // Add SMS charge data from SOAP response
      const withSmsData = this.soapConverter.convertChargeSmsToNormalizedFormat(soapResponse, normalizedData);
      
      return withSmsData;
    } catch (error) {
      throw new Error(`Failed to process user data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }


  /**
   * Processes  data from REST API
   * 
   * @param restResponse - REST API response
   * @returns Normalized data with usage information
   */
  public processRestData(restResponse: MvnoRestResponse): InternalNormalizedData {
    return this.restConverter.convertUsageToNormalizedFormat(restResponse);
  }

    /**
   * Processes multiple SOAP responses for the same user
   * 
   * @param soapResponses - Array of SOAP responses
   * @returns Normalized data with combined SMS charges
   */
    public processSmsCharges(soapResponses: MvnoSoapChargeSmsResponse[]): InternalNormalizedData {
      return this.soapConverter.batchConvert(soapResponses);
    }
}