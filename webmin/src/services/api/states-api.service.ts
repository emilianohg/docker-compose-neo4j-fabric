import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StatesApiService {

  private baseUrl = `${environment.url_api}/api/states`;

  constructor(private http: HttpClient) {}

  async index() {
    const data = await this.http.get(this.baseUrl, {
      params: {}
    }).toPromise();

    return data;
  }

}
