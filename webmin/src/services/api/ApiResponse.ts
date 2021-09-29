class ApiResponse<T> {

  readonly data: T;
  readonly status: boolean;

  constructor(data: T, status: boolean) {
    this.data = data;
    this.status = status;
  }

}
