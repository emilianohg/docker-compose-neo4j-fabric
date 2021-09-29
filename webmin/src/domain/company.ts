import { Coordinates } from './coordinates'
import { State } from './state'

export class Company {

  readonly name: string;
  readonly address: string;
  readonly coordinate: Coordinates;
  readonly state: State;

  constructor(name: string, address: string, state: State, coordinate: Coordinates) {
    this.name = name;
    this.address = address;
    this.coordinate = coordinate;
    this.state = state;
  }

}
