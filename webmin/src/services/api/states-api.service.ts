import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State } from '../../domain/state'

@Injectable()
export class StatesApiService {

  private baseUrl = `${environment.url_api}/api/states`;

  constructor(private http: HttpClient) {}

  index() {
    return this.http.get<ApiResponse<State[]>>(this.baseUrl);
  }

}
