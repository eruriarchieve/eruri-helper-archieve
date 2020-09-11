export default class PageError {
    public message: string;

    public redirect?: string

    constructor(message: string, redirect?: string) {
      this.message = message;
      this.redirect = redirect;
    }
}
