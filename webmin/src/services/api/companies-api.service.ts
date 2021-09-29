import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Company } from '../../domain/company'

@Injectable()
export class CompaniesApiService {

  private baseUrl = `${environment.url_api}/api/companies`;

  constructor(private http: HttpClient) {}

  async index(): Promise<Company[]> {
    const data = await this.http.get(this.baseUrl, {
      params: {}
    }).toPromise();

    // todo: data

    return data;
  }

}
