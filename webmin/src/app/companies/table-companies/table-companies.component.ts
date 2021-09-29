import { Component, OnInit } from '@angular/core';
import { Company } from '../../../domain/company';

@Component({
  selector: 'app-table-companies',
  templateUrl: './table-companies.component.html',
  styleUrls: ['./table-companies.component.css']
})
export class TableCompaniesComponent implements OnInit {

  companies: Company[];

  constructor() {
    this.companies = [];
  }

  ngOnInit(): void {
  }

}
