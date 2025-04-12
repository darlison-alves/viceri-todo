import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  constructor() { }

  login(email: string, password: string) {
    if (email === 'admin@example.com' && password === '123456') {
      this.loggedIn = true;
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
