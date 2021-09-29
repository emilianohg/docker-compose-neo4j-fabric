import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CompaniesComponent } from './companies/companies.component';
import { MapCompaniesComponent } from './companies/map-companies/map-companies.component';
import { TableCompaniesComponent } from './companies/table-companies/table-companies.component';

import { GeocodingService } from '../services/google-maps/geocoding.service';
import { CompaniesUi } from '../services/ui/companies-ui'

@NgModule({
  declarations: [
    AppComponent,
    CompaniesComponent,
    MapCompaniesComponent,
    TableCompaniesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    GeocodingService,
    CompaniesUi,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
