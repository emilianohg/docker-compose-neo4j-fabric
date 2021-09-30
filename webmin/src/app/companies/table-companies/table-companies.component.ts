import { Component, OnInit } from '@angular/core';
import { Company } from '../../../domain/company';
import { CompaniesApiService } from '../../../services/api/companies-api.service';
import { CompaniesUi } from '../../../services/ui/companies-ui';

@Component({
  selector: 'app-table-companies',
  templateUrl: './table-companies.component.html',
  styleUrls: ['./table-companies.component.css']
})
export class TableCompaniesComponent implements OnInit {

  companies: Company[];

  constructor(
    private api: CompaniesApiService,
    private ui: CompaniesUi,
  ) {
    this.companies = [];
    this.getCompanies();
  }

  ngOnInit(): void {
    this.ui.reloadCompaniesEvent().subscribe(_ => this.getCompanies());
  }

  delete(company: Company) {
    this.api.delete(company).subscribe(_ => this.ui.reloadCompanies());
  }

  edit(company: Company) {
    this.ui.editMode.next(company);
  }

  getCompanies() {
    this.api.index().subscribe(companies => this.companies = companies.data);
  }

}
