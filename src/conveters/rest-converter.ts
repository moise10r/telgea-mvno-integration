import { internalNormalizedData } from "../interfaces/internalNormalizedData";
import { MvnoRestResponse } from "../interfaces/MvnoRestResponse";

export class RestConverter {
  /**
   * Converts a REST Mvno response to the internal normalized format

   * @param restResponse - The REST response from the MVNO API
   * @returns The internal normalized data format
   */
  public convertUsageToNormalizedFormat(
    restResponse: MvnoRestResponse,
  ): internalNormalizedData {
    try {
      const normalizedData: internalNormalizedData = {
        telgea_user_id: restResponse.user_id,
        msisdn: restResponse.msisdn,
        usage_data: {
          total_mb: restResponse.usage.data.total_mb,
          roaming_mb: restResponse.usage.data.roaming_mb,
          country: restResponse.usage.data.country,
          network_type: restResponse.network.type,
          provider_code: restResponse.network.provider_code
        },
        sms_charges: [],
        billing_period: {
          start: restResponse.usage.period.start,
          end: restResponse.usage.period.end
        }
      };

      return normalizedData;
    } catch (error) {
      throw new Error(`Failed to convert REST response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

}