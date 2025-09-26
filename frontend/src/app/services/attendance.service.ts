// src/app/services/attendance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private base = 'http://10.70.9.8:3000/api/attendance';

  constructor(private http: HttpClient) { }

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


  listByEmp(empId: string) {
    return this.http.get<any[]>(`${this.base}/list/${empId}`);
  }


  list(startDate?: string, endDate?: string, empIdOrName?: string) {
    let url = `${this.base}/list`;
    const params: string[] = [];
    if (startDate && endDate) params.push(`start_date=${startDate}&end_date=${endDate}`);
    if (empIdOrName) params.push(`search=${empIdOrName}`);
    if (params.length) url += `?${params.join("&")}`;
    return this.http.get<any[]>(url);
  }

  exportToExcel(startDate?: string, endDate?: string, search?: string): Observable<Blob> {
    let url = `${this.base}/export/excel`;
    const params: string[] = [];
    if (startDate && endDate) params.push(`start_date=${startDate}&end_date=${endDate}`);
    if (search) params.push(`search=${search}`);
    if (params.length) url += `?${params.join("&")}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  exportToPdf(startDate?: string, endDate?: string, search?: string): Observable<Blob> {
    let url = `${this.base}/export/pdf`;
    const params: string[] = [];
    if (startDate && endDate) params.push(`start_date=${startDate}&end_date=${endDate}`);
    if (search) params.push(`search=${search}`);
    if (params.length) url += `?${params.join("&")}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getPendingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.base}/pending/count`);
  }

}
