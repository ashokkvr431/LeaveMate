import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-admin-attandance',
  templateUrl: './admin-attandance.component.html',
  styleUrls: ['./admin-attandance.component.scss'],
})
export class AdminAttandanceComponent implements OnInit {
  today = new Date().toISOString().slice(0, 10);
  form = { start_date: '', end_date: '', empId: '' };
  rows: any[] = [];
  err = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.loadAttendance(); // Load today’s attendance by default
  }

  // Load attendance with optional filters (dates + search)
  loadAttendance() {
    this.attendanceService
      .list(this.form.start_date, this.form.end_date, this.form.empId)
      .subscribe({
        next: (res) => (this.rows = res),
        error: (e) => console.error(e),
      });
  }

  // Called on search form submit
  search() {
    this.loadAttendance();
  }

  // Export Excel
  exportExcel() {
    let start = this.form.start_date
      ? formatDate(this.form.start_date, 'yyyy-MM-dd', 'en')
      : undefined;
    let end = this.form.end_date
      ? formatDate(this.form.end_date, 'yyyy-MM-dd', 'en')
      : undefined;

    this.attendanceService
      .exportToExcel(start, end, this.form.empId)
      .subscribe((data: Blob) => this.downloadFile(data, 'attendance.xlsx'));
  }

  // Export PDF
  exportPdf() {
    let start = this.form.start_date
      ? formatDate(this.form.start_date, 'yyyy-MM-dd', 'en')
      : undefined;
    let end = this.form.end_date
      ? formatDate(this.form.end_date, 'yyyy-MM-dd', 'en')
      : undefined;

    this.attendanceService
      .exportToPdf(start, end, this.form.empId)
      .subscribe((data: Blob) => this.downloadFile(data, 'attendance.pdf'));
  }

  // Utility: download file
  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Format time into 12-hr with AM/PM
  formatTime(time: string | null): string {
    if (!time) return '';
    const [hourStr, minStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minutes = minStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minutes} ${ampm}`;
  }

  
}
