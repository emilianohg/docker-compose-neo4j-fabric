import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators'
import { CompaniesUi, modeCompany, viewCompany } from '../../services/ui/companies-ui'
import { CompaniesApiService } from '../../services/api/companies-api.service'
import { State } from '../../domain/state';
import { StatesApiService } from '../../services/api/states-api.service'
import { Country } from '../../domain/country'
import { CountriesApiService } from '../../services/api/countries-api.service'
import { GeocodingService } from '../../services/google-maps/geocoding.service'
import { Company } from '../../domain/company'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  view: viewCompany = 'map';
  mode: modeCompany = 'create';

  submitted = false;
  form: FormGroup;
  states: State[];
  countries: Country[];
  addressSuggestion = {
    valid: false,
    address: '',
  };
  companyEditing: Company | null;

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
    this.companyEditing = null;

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

    this.companiesUi.changeModeEvent().subscribe(company => {

      this.companyEditing = company;

      if (company === null) {
        this.mode = 'create';
        this.resetForm();

        if (this.countries.length > 1) {
          this.form.get('country')?.enable();
        }
        return;
      }

      this.mode = 'edit';
      this.form.get('country')?.disable();
      this.form.get('state')?.disable();

      this.loadCompany(company);

    });

    this.form.controls.country.valueChanges.subscribe(value => {

      if (value == null) {
        return;
      }

      this.form.get('state')?.disable();

      if (this.mode == 'create') {
        if (this.countries.length > 1) {
          this.form.get('state')?.enable();
        }
        this.form.get('state')?.setValue('');
      }

      if (this.countries.length > 1) {
        this.apiStates.index(value).subscribe(states => {
          this.states = states.data;
        });
      }
    });


    this.apiCountries.index().pipe(switchMap(countries => {
      this.countries = countries;
      if (this.countries.length === 1) {
        const country = this.countries[0];
        this.form.get('country')?.setValue(country.id);
        this.form.get('country')?.disable();
      }
      if (this.countries.length > 1) {
        this.form.get('state')?.disable()
      } else {
        this.form.get('state')?.enable()
      }
      return this.apiStates.index();
    }))
      .subscribe(states => {
        this.states = states.data;
      });
  }


  ngOnInit(): void {

  }

  save() {

    this.submitted = true;
    if(this.form.invalid || !this.addressSuggestion.valid){
      return;
    }

    if (this.mode == 'edit' && this.companyEditing?.id != null) {

      this.apiCompanies.update(this.companyEditing.id, {
        name:     this.form.get('name')?.value,
        address:  this.addressSuggestion.address,
        lat:      this.form.get('latitude')?.value,
        lon:      this.form.get('longitude')?.value,
        countryid:this.form.get('country')?.value,
        stateid:  this.form.get('state')?.value,
      }).subscribe(_ => {
        this.companiesUi.changeMode(null);
        this.companiesUi.reloadCompanies();
      });

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
      this.resetForm();
      this.companiesUi.reloadCompanies();
    });

  }

  changeView(view: viewCompany) {
    this.companiesUi.changeView(view);
  }


  resetForm() {
    this.form.reset();
    let country = null;
    if (this.countries.length == 1) {
      country = this.countries[0];
      this.form.get('country')?.setValue(country.id);
    }
    if(this.mode == 'create' && country != null) {
      this.form.get('state')?.enable();
    }
  }

  cancelEditing() {
    this.companiesUi.changeMode(null);
  }

  loadCompany(company: Company) {
    this.form.get('country')?.setValue(company.state.country);
    this.form.get('state')?.setValue(company.state.id);
    this.form.get('name')?.setValue(company.name);
    this.form.get('address')?.setValue(company.address);
    this.form.get('latitude')?.setValue(company.coordinate.latitude);
    this.form.get('longitude')?.setValue(company.coordinate.longitude);
  }

  delete() {
    if (this.companyEditing != null) {
      this.apiCompanies.delete(this.companyEditing).subscribe(_ => {
        this.companiesUi.changeMode(null);
        this.companiesUi.reloadCompanies();
      });
    }
  }

  get hasMexico() {
    return environment.countries.filter(c => c.id == 'mexico').length > 0;
  }

  get hasCanada() {
    return environment.countries.filter(c => c.id == 'canada').length > 0;
  }

  get hasUSA() {
    return environment.countries.filter(c => c.id == 'usa').length > 0;
  }
}
