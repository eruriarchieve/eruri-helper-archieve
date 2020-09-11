export default class APIError {
    public message: string;

    public status?: number;

    public redirect?: string;

    constructor(message: string, status?: number, redirect?: string) {
      this.message = message;
      this.status = status;
      this.redirect = redirect;
    }
}
