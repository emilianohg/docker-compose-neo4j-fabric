import { Company } from '../../domain/company';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

export type viewCompany = 'map' | 'table';

@Injectable()
export class CompaniesUi {

  subject = new Subject<viewCompany>();

  private companies: Company[];

  private view: viewCompany = 'map';

  constructor() {
    this.companies = [];
  }

  public changeView(view: viewCompany): void {
    this.subject.next(view);
  }

  public subscribeView(): Observable<viewCompany> {
    return this.subject.asObservable();
  }

/*
  public addCompany(company: Company) {
    this.companies.push(company);
  }

  public updateCompany(company: Company) {

  }

  public deleteCompany(company: Company) {

  }

  public indexCompany() {

  }
*/
}
