import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeocodingService {

  private baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  async search(address: string): Promise<any> {
    const data = await this.http.get(this.baseUrl, {
      params: {
        address: address,
        key: environment.google_map_key
      }
    }).toPromise();

    return data;
  }

}
