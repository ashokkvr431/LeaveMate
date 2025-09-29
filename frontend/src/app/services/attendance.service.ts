import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attendance {
  empId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half-Day';
  loginTime?: string;
  logoutTime?: string;
}

export interface Summary {
  percentage: number;
  presentDays: number;
  totalDays: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private base = 'http://10.70.9.8:3000/api/attendance';

  constructor(private http: HttpClient) {}

  login(empId: string, coords: { lat: number; lng: number }) {
    return this.http.post(`${this.base}/login`, {
      empId,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  }

  logout(empId: string, coords: { lat: number; lng: number }) {
    return this.http.post(`${this.base}/logout`, {
      empId,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  }

  listByEmp(empId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.base}/list/${empId}`);
  }

  list(startDate?: string, endDate?: string, empIdOrName?: string): Observable<Attendance[]> {
    let params = new HttpParams();
    if (startDate && endDate) {
      params = params.set('start_date', startDate).set('end_date', endDate);
    }
    if (empIdOrName) {
      params = params.set('search', empIdOrName);
    }
    return this.http.get<Attendance[]>(`${this.base}/list`, { params });
  }

  exportToExcel(startDate?: string, endDate?: string, search?: string): Observable<Blob> {
    let params = new HttpParams();
    if (startDate && endDate) params = params.set('start_date', startDate).set('end_date', endDate);
    if (search) params = params.set('search', search);
    return this.http.get(`${this.base}/export/excel`, { params, responseType: 'blob' });
  }

  exportToPdf(startDate?: string, endDate?: string, search?: string): Observable<Blob> {
    let params = new HttpParams();
    if (startDate && endDate) params = params.set('start_date', startDate).set('end_date', endDate);
    if (search) params = params.set('search', search);
    return this.http.get(`${this.base}/export/pdf`, { params, responseType: 'blob' });
  }

  getPendingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.base}/pending/count`);
  }

  getAttendanceSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.base}/summary`);
  }

  getTodayAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.base}/today`);
  }

}
  