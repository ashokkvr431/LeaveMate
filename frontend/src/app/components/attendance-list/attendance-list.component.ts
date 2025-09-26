// src/app/components/attendance-list/attendance-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { ProfileService } from '../../services/profile.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss'],
})
export class AttendanceListComponent implements OnInit {
  records: any[] = [];
  empId: string | null = null;

  constructor(private attendance: AttendanceService, private profile: ProfileService) {}

  ngOnInit() {
    this.profile.profile$.subscribe(profile => {
      if (profile?.empId) {
        this.empId = profile.empId;
        this.load();
      }
    });

    // fallback from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.empId) {
        this.empId = parsed.empId;
        this.load();
      }
    }
  }

  load() {
    if (!this.empId) return;
    this.attendance.listByEmp(this.empId).subscribe(res => this.records = res || []);
  }

  formatTime(time: string | null): string {
    if (!time) return '-';
    const [hourStr, minStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minutes = minStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minutes} ${ampm}`;
  }

  formatDateTime(datetime: string | null): string {
    if (!datetime) return '-';
    // Convert string to Date
    const dt = new Date(datetime);
    // Format: e.g., "Sep 18, 2025, 09:05 AM" hh:mm a'
    return formatDate(dt, 'd MMM y', 'en-US');
  }

}
