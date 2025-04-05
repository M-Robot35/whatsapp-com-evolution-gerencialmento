import axios, { AxiosRequestConfig } from 'axios';
import { Logs } from '../system';

export interface IHttpClient {
    request(config: IHttpRequestConfig): Promise<any>;
}

export interface IHttpRequestConfig<T=any> {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
    authorization?: string;
    body?: T;
    headers?: Record<string, any>;
}


class AxiosHttpClient implements IHttpClient {
    async request(config: IHttpRequestConfig): Promise<any|null> {
        const axiosConfig: AxiosRequestConfig = {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.body,
            //timeout: 10000
        };

        if(config.authorization){
            axiosConfig.headers= {
                ...axiosConfig.headers, Authorization: `Bearer ${config.authorization}`
            }
        }

        const response = await axios(axiosConfig);
        if(response.status == 401){
            Logs.error('AxiosHttpClient','AxiosHttpClient - ERRO de USUÁRIO NÃO AUTORIZADO ')
            return null
        }
        
        if(!response.status.toString().startsWith('2')){
            Logs.error('AxiosHttpClient', `Error ao fazer a requisição ${response.status} -- ${JSON.stringify(response.data)}`)
        }

        Logs.success('AxiosHttpClient','AxiosHttpClient - HTTP REQUESST SUCCESS ')
        return response.data;        
    }
}


class HttpRequest {

    constructor(private httpClient: IHttpClient) {}

    async request(data: IHttpRequestConfig) {
        return this.httpClient.request(data);
    }

    async post(data: Omit<IHttpRequestConfig, 'method'>) {
        return this.request({ ...data, method: 'POST', headers: data.headers});
    }

    async get(data: Omit<IHttpRequestConfig, 'method' | 'body'>) {
        return this.request({ ...data, method: 'GET', headers: data.headers });
    }
}

export default new HttpRequest(new AxiosHttpClient())