import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private base = 'http://10.70.9.8:3000/api/profile';

  private profileSubject = new BehaviorSubject<any>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.profileSubject.next(JSON.parse(saved));
    }
  }

  private headers(): HttpHeaders {
    const token = this.auth.token();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.base}/me`, { headers: this.headers() }).pipe(
      tap((profile) => {
        this.profileSubject.next(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      })
    );
  }

  updateProfile(data: any): Observable<any> {
    let headers = this.headers();
    if (data instanceof FormData) {
      headers = new HttpHeaders({
        Authorization: `Bearer ${this.auth.token()}`,
      });
    }

    return this.http.put<any>(`${this.base}/me`, data, { headers }).pipe(
      tap((updatedUser) => {
        if (updatedUser && updatedUser.id) {
          this.profileSubject.next(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      })
    );
  }

  refreshProfile() {
    this.getProfile().subscribe();
  }
}
