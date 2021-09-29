import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Injectable()
export class CompaniesApiService {

  private baseUrl = `${environment.url_api}/api/companies`;

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
