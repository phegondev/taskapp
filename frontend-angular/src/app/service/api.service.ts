import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private API_URL = "http://18.217.39.141:3030/api" //prod url
  private API_URL = "http://localhost:3030/api"

  constructor(private http: HttpClient) { }


  saveToken(token: string): void {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  private getHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    });
  }

  //REGISTER USER
  registerUser(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, body);
  }



  // TASKS API
  createTask(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/tasks`, body, {
      headers: this.getHeader()
    });
  }

  updateTask(body: any): Observable<any> {
    return this.http.put(`${this.API_URL}/tasks`, body, {
      headers: this.getHeader()
    });
  }

  getAllMyTasks(): Observable<any> {
    return this.http.get(`${this.API_URL}/tasks`, {
      headers: this.getHeader()
    });
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/tasks/${taskId}`, {
      headers: this.getHeader()
    });
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/tasks/${taskId}`, {
      headers: this.getHeader()
    });
  }

  getMyTasksByCompletionStatus(completed: boolean): Observable<any> {
    return this.http.get(`${this.API_URL}/tasks/status`, {
      headers: this.getHeader(),
      params: {
        completed: completed
      }
    });
  }

  getMyTasksByPriority(priority: string): Observable<any> {
    return this.http.get(`${this.API_URL}/tasks/priority`, {
      headers: this.getHeader(),
      params: {
        priority: priority
      }
    });
  }





}
