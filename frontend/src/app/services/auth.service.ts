import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://10.70.9.8:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(body: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, body).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.base}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // --- Token & User ---
  token(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // --- Checks ---
  isLoggedIn(): boolean {
    return !!this.token();
  }

  getRole(): string | null {
    return this.getUser()?.role || null;
  }

  isAdmin(): boolean {
    return this.getRole()?.trim().toLowerCase() === 'admin';
  }

  isUser(): boolean {
    return this.getRole()?.trim().toLowerCase() === 'user';
  }

  getProfile() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload; 
    } catch (err) {
      return null;
    }
  }


}
