import { Message } from "./message";

export interface InternalFormat {
  telgea_user_id: string;
  msisdn: string;
  usage_data: {
    total_mb: number;
    roaming_mb: number;
    country: string;
    network_type: string;
    provider_code: string;
  };
  sms_charges: Array<Message>;
  billing_period: {
    start: string;
    end: string;
  };
}