export class State {

  readonly id: number
  readonly name: string
  readonly country: string

  constructor(id: number, name: string, country: string) {
    this.id = id;
    this.name = name;
    this.country = country;
  }

}
