export interface ExternalAirlineData {
  name: string;
  code: string;
  country: string;
  logo?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source?: string;
}

export interface AirlineApiProvider {
  name: string;
  fetchAirlines(): Promise<ApiResponse<ExternalAirlineData[]>>;
  fetchAirlineByCode(code: string): Promise<ApiResponse<ExternalAirlineData>>;
}
