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
  companyHovered: Company | null;
  isFixed = false;

  constructor(
    private google: GoogleMapsService,
    private api: CompaniesApiService,
    private ui: CompaniesUi
  ) {
    this.gmap = new ElementRef<any>('div');
    this.companies = [];
    this.companyHovered = null;
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
      disableDefaultUI: true,
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

        map.addListener('click', () => {
          this.isFixed = false;
          this.companyHovered = null;
          this.ui.changeMode(null);
        });

        marker.addListener('click', () => {
          this.ui.changeMode(c);
          this.isFixed = true;
          this.companyHovered = c;
        });

        marker.addListener("mouseover", () => {
          if (!this.isFixed && this.companyHovered == null) {
            this.companyHovered = c;
          }
        });

        marker.addListener("mouseout", () => {
          if (!this.isFixed) {
            this.companyHovered = null;
          }
        });

      });
    });
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
