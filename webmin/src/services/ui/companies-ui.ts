import { Company } from '../../domain/company';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

export type viewCompany = 'map' | 'table';

@Injectable()
export class CompaniesUi {

  currentView = new Subject<viewCompany>();
  companiesReloaded = new Subject<boolean>();

  private companies: Company[];

  private view: viewCompany = 'map';

  constructor() {
    this.companies = [];
  }

  public changeView(view: viewCompany): void {
    this.currentView.next(view);
  }

  public subscribeViewEvent(): Observable<viewCompany> {
    return this.currentView.asObservable();
  }

  public reloadCompanies() {
    this.companiesReloaded.next(true);
  }

  public reloadCompaniesEvent(): Observable<boolean> {
    return this.companiesReloaded.asObservable();
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
