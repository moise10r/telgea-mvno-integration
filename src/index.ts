import { InternalFormat } from "./interfaces/internal";
import { MvnoRestResponse } from "./interfaces/mvno_rest";
import restData from './mocks/mvno_rest_response.json';
export function convertRestToInternal(restData: MvnoRestResponse): InternalFormat {
  return {
    telgea_user_id: restData.user_id,
    msisdn: restData.msisdn,
    usage_data: {
      total_mb: restData.usage.data.total_mb,
      roaming_mb: restData.usage.data.roaming_mb,
      country: restData.usage.data.country,
      network_type: restData.network.type,
      provider_code: restData.network.provider_code,
    },
    sms_charges: [], 
    billing_period: {
      start: restData.usage.period.start,
      end: restData.usage.period.end,
    },
  };
}
const base = convertRestToInternal(restData);
console.log('base', base);

console.log('Server is running')