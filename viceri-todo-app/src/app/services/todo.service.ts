import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.contants';
import { PriorityEnum } from '../enums/priority.enum';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem("token")}`
  });

  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get<any>(`${API_URL}/todos`, { headers: this.httpHeaders });
  }

  addTask(title: string, priority: PriorityEnum ) {
    return this.http.post<any>(`${API_URL}/todos`, { title, priority }, { headers: this.httpHeaders });
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${API_URL}/todos/${id}`, { headers: this.httpHeaders });
  }
  toggleTask(id: number, done: boolean) {
    return this.http.put<any>(`${API_URL}/todos/${id}`, { done }, { headers: this.httpHeaders });
  }
}
