import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Loader, LoaderOptions } from 'google-maps';
import { environment } from '../../../environments/environment'
import { GoogleMapsService } from '../../../services/google-maps/google-maps.service'
import { Company } from '../../../domain/company'
import { CompaniesApiService } from '../../../services/api/companies-api.service'
import { CompaniesUi } from '../../../services/ui/companies-ui'


@Component({
  selector: 'app-map-companies',
  templateUrl: './map-companies.component.html',
  styleUrls: ['./map-companies.component.css']
})
export class MapCompaniesComponent implements OnInit {

  @ViewChild('gmapContainer', {static: false}) gmap: ElementRef;
  private companies: Company[];

  constructor(
    private google: GoogleMapsService,
    private api: CompaniesApiService,
    private ui: CompaniesUi
  ) {
    this.gmap = new ElementRef<any>('div');
    this.companies = [];
  }

  ngOnInit(): void {
    this.initMap();
    this.ui.reloadCompaniesEvent().subscribe(_ => this.initMap());
  }

  async initMap() {
    const google = await this.google.load();
    const map = new google.maps.Map(this.gmap.nativeElement, {
      center: environment.map.center,
      zoom: environment.map.zoom,
    });

    this.api.index().subscribe(companies => {
      this.companies = companies.data;
      this.companies.map(c => {
        const marker = new google.maps.Marker({
          position: {
            lat: Number(c.coordinate.latitude),
            lng: Number(c.coordinate.longitude),
          },
          map,
        });
        marker.addListener('click', () => {
          this.ui.changeMode(c);
        });
      });
    });
  }



}
