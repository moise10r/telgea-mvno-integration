import { InternalSmsCharge } from "./internalSmsCharge";

export interface internalNormalizedData{
  telgea_user_id: string;
  msisdn: string;
  usage_data: {
    total_mb: number;
    roaming_mb: number;
    country: string;
    network_type: string;
    provider_code: string;
  };
  sms_charges: Array<InternalSmsCharge>;
  billing_period: {
    start: string;
    end: string;
  };
}