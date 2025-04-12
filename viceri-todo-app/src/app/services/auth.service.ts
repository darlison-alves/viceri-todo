import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.contants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<{token: string}>(`${API_URL}/users/authenticate`, { email, password });
  }

  logout() {
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
}
