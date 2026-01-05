import { AxiosRequestHeaders } from 'axios';

export interface IAxiosConfig {
  BASE_URL: string;
  HEADERS?: AxiosRequestHeaders | Record<string, string>;
  TIMEOUT?: number;
}

export interface IAxiosInterceptor {
  config?: IAxiosConfig;
  loaderComponent?: React.ReactNode;
}

export interface IErrorResponse {
  error: string;
  status: number;
  message: string;
  success: boolean;
}