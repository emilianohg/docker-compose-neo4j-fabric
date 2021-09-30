import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators'
import { CompaniesUi, viewCompany } from '../../services/ui/companies-ui'
import { CompaniesApiService } from '../../services/api/companies-api.service'
import { State } from '../../domain/state';
import { StatesApiService } from '../../services/api/states-api.service'
import { Country } from '../../domain/country'
import { CountriesApiService } from '../../services/api/countries-api.service'
import { GeocodingService } from '../../services/google-maps/geocoding.service'

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  view: 'map' | 'table' = 'map';

  submitted = false;
  form: FormGroup;
  states: State[];
  countries: Country[];
  addressSuggestion = {
    valid: false,
    address: '',
  };

  constructor(
    private fb: FormBuilder,
    private geocoding: GeocodingService,
    private companiesUi: CompaniesUi,
    private apiCompanies: CompaniesApiService,
    private apiStates: StatesApiService,
    private apiCountries: CountriesApiService,
  ) {

    this.states = [];
    this.countries = [];

    this.form = this.fb.group({
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      latitude: [{ value: null, disabled: true }, Validators.required],
      longitude: [{ value: null, disabled: true }, Validators.required],
    });


    this.form.controls.address.valueChanges.pipe(
      tap(_ => {
        this.addressSuggestion.valid = false;
        this.form.get('latitude')?.setValue(null);
        this.form.get('longitude')?.setValue(null);
      }),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(async value => {
      console.log(value);
      if (value && value.length > 0) {

        const data = await this.geocoding.search(value);

        if (data.results.length == 0) {
          this.addressSuggestion.valid = false;
          return;
        }

        const record = data.results[0];

        this.addressSuggestion.valid = true;
        this.addressSuggestion.address = record.formatted_address;

        this.form.get('latitude')?.setValue(record.geometry.location.lat.toFixed(5));
        this.form.get('longitude')?.setValue(record.geometry.location.lng.toFixed(5));

      }
    });

    this.companiesUi
      .subscribeViewEvent()
      .subscribe(view => this.view = view);


    this.apiStates.index().subscribe(states => this.states = states.data);
    this.apiCountries.index().subscribe(countries => {
      this.countries = countries;

      if (this.countries.length === 1) {
        const country = this.countries[0];
        this.form.get('country')?.setValue(country.id);
        this.form.get('country')?.disable();
      }
    });
  }


  ngOnInit(): void {

  }

  save() {

    this.submitted = true;
    if(this.form.invalid || !this.addressSuggestion.valid){
      return;
    }

    this.apiCompanies.save({
      name:     this.form.get('name')?.value,
      address:  this.addressSuggestion.address,
      lat:      this.form.get('latitude')?.value,
      lon:      this.form.get('longitude')?.value,
      countryid:this.form.get('country')?.value,
      stateid:  this.form.get('state')?.value,
    }).subscribe(_ => {
      this.companiesUi.reloadCompanies();
      this.resetForm();
    });

  }

  changeView(view: viewCompany) {
    this.companiesUi.changeView(view);
  }


  resetForm() {
    this.form.reset();
    if (this.countries.length == 1) {
      const country = this.countries[0];
      this.form.get('country')?.setValue(country.id);
    }
  }
}
