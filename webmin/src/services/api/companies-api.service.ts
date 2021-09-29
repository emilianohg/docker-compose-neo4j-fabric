import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators'
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

  delete(id: string) {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }

}
