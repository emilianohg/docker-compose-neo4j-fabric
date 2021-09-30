import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Company } from '../../domain/company'

@Injectable()
export class CompaniesApiService {

  private baseUrl = `${environment.url_api}/api/companies`;

  constructor(private http: HttpClient) {}

  index() {
    return this.http.get<ApiResponse<Company[]>>(this.baseUrl, {
      params: {}
    }).pipe( // todo: remover si no se ocupa
      map(data => {
        return data;
      })
    );
  }

  delete(company: Company) {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${company.id}`, {
      params: {
        countryid: company.state.country
      }
    });
  }

  save(data: any) {
    console.log(data);
    return this.http.post<ApiResponse<Company[]>>(this.baseUrl, data);
  }

  update(id:string, data: any) {
    console.log(id, data);
    return this.http.put<ApiResponse<Company[]>>(`${this.baseUrl}/${id}`, data);
  }

}
