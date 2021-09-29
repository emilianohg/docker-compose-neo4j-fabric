import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Country } from '../../domain/country'
import { Observable, of } from 'rxjs'


@Injectable()
export class CountriesApiService {

  constructor() {}

  index(): Observable<Country[]> {
    return of(environment.countries);
  }

}
