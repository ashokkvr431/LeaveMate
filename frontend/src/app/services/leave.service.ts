import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private base = 'http://10.70.9.8:3000/api/leaves';

  constructor(private http: HttpClient) { }

  applyLeave(data: FormData): Observable<any> {
    return this.http.post(`${this.base}/apply`, data);
  }

  myLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/my`);
  }

  adminApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/pending`);
  }

  updateApproval(id: number, status: 'approved' | 'rejected', comment?: string) {
    return this.http.put(`${this.base}/${id}/status`, {
      status,
      manager_comment: comment || ''
    });
  }

  getApprovedLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/approved`);
  }

  getRejectedLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/rejected`);
  }

  
}

