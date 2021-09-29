import { Coordinates } from './coordinates'

export class Company {

  readonly name: string;
  readonly address: string;
  readonly coordinate: Coordinates;
  readonly state: string;
  readonly country: string;

  constructor(name: string, address: string, state: string, country: string, coordinate: Coordinates) {
    this.name = name;
    this.address = address;
    this.coordinate = coordinate;
    this.state = state;
    this.country = country;
  }

}
