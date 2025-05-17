import { InternalNormalizedData } from "../interfaces/internalNormalizedData";
import { InternalSmsCharge } from "../interfaces/internalSmsCharge";
import { MvnoSoapChargeSmsResponse } from "../interfaces/mvnoSoapChargeSmsResponse";
import { parseSoapXML } from "../utils/xmlParser";
import fs from 'fs';


/**
 * Converter for SOAP API responses to internal normalized format
 */
export class SoapConverter {
  /**
   * Converts a SOAP ChargeSMS response to the internal normalized format
   * 
   * @param soapResponse - The SOAP response from the MVNO API
   * @returns The internal normalized data format
   */
  
 public convertChargeSmsToNormalizedFormat(
   soapResponse: MvnoSoapChargeSmsResponse,
   existingData?: Partial<InternalNormalizedData>
 ): InternalNormalizedData {
   try {

     const smsData = soapResponse['soapenv:Envelope']['soapenv:Body']['sms:ChargeSMS'];
     
     const smsCharge: InternalSmsCharge =  {
       message_id: smsData['sms:MessageID'],
       timestamp: smsData['sms:Timestamp'],
       amount: parseFloat(smsData['sms:ChargeAmount']),
       currency: smsData['sms:Currency']
     };

     const normalizedData: InternalNormalizedData = {
       telgea_user_id: existingData?.telgea_user_id || smsData['sms:UserID'],
       msisdn: existingData?.msisdn || smsData['sms:PhoneNumber'],
       usage_data: existingData?.usage_data || {
         total_mb: 0,
         roaming_mb: 0,
         country: '',
         network_type: '',
         provider_code: ''
       },
       sms_charges: existingData?.sms_charges 
         ? [...existingData.sms_charges, smsCharge] 
         : [smsCharge],
       billing_period: existingData?.billing_period || {
         start: this.extractDateFromTimestamp(smsData['sms:Timestamp']),
         end: this.getEndOfMonth(smsData['sms:Timestamp'])
       }
     };

     return normalizedData;
   } catch (error) {
     throw new Error(`Failed to convert SOAP response: ${error instanceof Error ? error.message : String(error)}`);
   }
 }


  /**
   * Extracts the date portion from a timestamp and sets it to the start of the day
   * 
   * @param timestamp - ISO timestamp string
   * @returns ISO date string for the start of the day
   */
  private extractDateFromTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      // Set to start of day
      date.setUTCHours(0, 0, 0, 0);
      return date.toISOString();
    } catch (error) {
      throw new Error(`Invalid timestamp format: ${timestamp}`);
    }
  }

  /**
   * Gets the end of the month for a given timestamp
   * 
   * @param timestamp - ISO timestamp string
   * @returns ISO date string for the end of the month
   */
  private getEndOfMonth(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      // Set to next month
      date.setUTCMonth(date.getUTCMonth() + 1, 0);
      // Set to end of day
      date.setUTCHours(23, 59, 59, 999);
      return date.toISOString();
    } catch (error) {
      throw new Error(`Invalid timestamp format: ${timestamp}`);
    }
  }
}