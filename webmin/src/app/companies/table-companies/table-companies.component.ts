import { Component, OnInit } from '@angular/core';
import { Company } from '../../../domain/company';
import { CompaniesApiService } from '../../../services/api/companies-api.service'

@Component({
  selector: 'app-table-companies',
  templateUrl: './table-companies.component.html',
  styleUrls: ['./table-companies.component.css']
})
export class TableCompaniesComponent implements OnInit {

  companies: Company[];

  constructor(
    private api: CompaniesApiService,
  ) {
    this.companies = [];
    this.api.index().subscribe(companies => this.companies = companies.data);
  }

  ngOnInit(): void {
  }

}
