import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { google, Loader, LoaderOptions } from 'google-maps'

@Injectable()
export class GoogleMapsService {

  private _google: google | null;
  readonly loader: Loader;

  constructor() {
    const options: LoaderOptions = {
      libraries: ['places']
    };
    this._google = null;
    this.loader = new Loader(environment.google_map_key, options);
  }

  async load() {
    if (this._google == null) {
      this._google = await this.loader.load();
    }
    return this._google;
  }

}
