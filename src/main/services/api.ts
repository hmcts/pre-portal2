import axios from 'axios';

export default class Api {
  private baseUrl = process.env.API_URL;
  private apiKey = process.env.API_KEY;
  private headers;

  constructor(baseUrl?: string, apiKey?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
    else if (!this.baseUrl) {
      throw new Error('No base url supplied and no default set in environment variables');
    }

    if (apiKey) {
      this.apiKey = apiKey;
    }
    else if (!this.apiKey) {
      throw new Error('No api key supplied and no default set in environment variables');
    }

    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'UserId': ''
    };
  }

  private async request(type: string, endpoint: string, userId: string, data?: any) {
    let {headers} = this;
    headers.UserId = userId;
    return axios({
      method: type,
      url: `${this.baseUrl}/${endpoint}`,
      data: data,
      headers: headers
    });
  }

  public async getRecordings(userId: string, search?: any, page?: number, pageSize?: number) {
    let data = {
      userId: userId,
      search: search,
      page: page,
      pageSize: pageSize
    };

    let response = await this.request('GET', 'recordings', userId, data);
    // TODO: transform the response to a more usable format
    return response.data;
  }

  public async getRecording(userId: string, recordingId: string) {
    let data = {
      userId: userId,
      recordingId: recordingId
    };
    let response = await this.request('GET', `recordings/${recordingId}`, userId, data);
    // TODO: transform the response to a more usable format
    return response.data;
  }
}
