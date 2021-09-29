import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { Company } from '../../domain/company'

@Injectable()
export class CompaniesApiService {

  private baseUrl = `${environment.url_api}/api/companies`;

  constructor(private http: HttpClient) {}

  index() {
    return this.http.get<ApiResponse<Company[]>>(this.baseUrl, {
      params: {}
    }).pipe(
      map(data => {
        console.log(data);
        return data;
      })
    );
  }

}
