export interface MvnoRestResponse {
  user_id: string;
  msisdn: string;
  usage: {
    data: {
      total_mb: number;
      roaming_mb: number;
      country: string;
    };
    period: {
      start: string;
      end: string;
    };
  };
  network: {
    type: string;
    provider_code: string;
  };
}