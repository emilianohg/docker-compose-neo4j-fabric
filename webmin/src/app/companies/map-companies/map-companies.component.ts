import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Loader, LoaderOptions } from 'google-maps';
import { environment } from '../../../environments/environment'


@Component({
  selector: 'app-map-companies',
  templateUrl: './map-companies.component.html',
  styleUrls: ['./map-companies.component.css']
})
export class MapCompaniesComponent implements OnInit {

  @ViewChild('gmapContainer', {static: false}) gmap: ElementRef;

  constructor() {
    this.gmap = new ElementRef<any>('div');
  }

  ngOnInit(): void {
    this.initMap();
  }

  async initMap() {

    const options: LoaderOptions = {
      libraries: ['places']
    };
    const loader = new Loader(environment.google_map_key, options);

    const google = await loader.load();
    const map = new google.maps.Map(this.gmap.nativeElement, {
      center: {lat: 23.634501, lng: -102.552784},
      zoom: 6,
    });
  }

}
