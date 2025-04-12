import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.contants';
import { IUserRegister } from '../../interfaces/user.register';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  register(user: IUserRegister) {
    return this.http.post<any>(`${API_URL}/users`, user);
  }

}
