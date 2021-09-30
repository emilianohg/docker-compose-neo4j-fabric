import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State } from '../../domain/state'

@Injectable()
export class StatesApiService {

  private baseUrl = `${environment.url_api}/api/states`;

  constructor(private http: HttpClient) {}

  index(country?: string) {
    const params : { country?: string } = {};

    if (country !== undefined) {
      params['country'] = country;
    }

    return this.http.get<ApiResponse<State[]>>(this.baseUrl, {
      params: params
    });
  }

}
