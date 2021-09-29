import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable()
export class StatesApiService {

  private baseUrl = `${environment.url_api}/api/states`;

  constructor(private http: HttpClient) {}

  index() {
    return this.http.get(this.baseUrl, {
      params: {}
    }).pipe(
      map(data => {
        console.log(data);
        return data;
      })
    );
  }

}
