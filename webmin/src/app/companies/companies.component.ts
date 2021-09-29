import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { GeocodingService } from '../../services/google-maps/geocoding.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { CompaniesUi, viewCompany } from '../../services/ui/companies-ui'

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  view: 'map' | 'table' = 'map';

  form: FormGroup;
  private submitted = false;

  constructor(
    private fb: FormBuilder,
    private geocoding: GeocodingService,
    private companiesUi: CompaniesUi
  ) {
    this.form = this.fb.group({
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      latitude: [{ value: null, disabled: true }, Validators.required],
      longitude: [{ value: null, disabled: true }, Validators.required],
    });

    this.form.controls.address.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      const data = this.geocoding.search(value);
      console.log(data);
    });

  }

  ngOnInit(): void {
    this.companiesUi
      .subscribeView()
      .subscribe(view => this.view = view);
  }

  save() {

    this.submitted = true;
    if(this.form.invalid){
      return;
    }


  }

  changeView(view: viewCompany) {
    this.companiesUi.changeView(view);
  }

}
