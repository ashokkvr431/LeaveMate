// src/app/components/attendance-mark/attendance-mark.component.ts
import { Component, OnInit } from "@angular/core";
import { AttendanceService } from "../../services/attendance.service";
import { ProfileService } from "../../services/profile.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-attendance-mark",
  templateUrl: "./attendance-mark.component.html",
  styleUrls: ["./attendance-mark.component.scss"],
})
export class AttendanceMarkComponent implements OnInit {
  attendanceList: any[] = [];
  today = new Date();
  currentTime = new Date();
  empId: string | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile: any) => {
      if (profile && profile.empId) {
        this.empId = profile.empId;
        this.loadAttendance();
      }
    });

    // fallback from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.empId) {
        this.empId = parsed.empId;
        this.loadAttendance();
      }
    }
  }

  login() {
    if (!this.empId) {
      alert("Employee ID missing!");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.attendanceService.login(this.empId!, coords).subscribe({
          next: (res: any) => {
            alert(res.message);
            this.loadAttendance();
          },
          error: (err: any) => {
            console.error("Login error:", err);
            alert("Login failed: " + (err.error?.error || "Unknown error"));
          },
        });
      },
      (err) => {
        console.warn("Geolocation error:", err);
        const fallback = { lat: 16.972499, lng: 82.240390 };
        this.attendanceService.login(this.empId!, fallback).subscribe({
          next: (res: any) => {
            alert("Location denied, using fallback coords.\n" + res.message);
            this.loadAttendance();
          },
          error: (err: any) => {
            console.error("Login error:", err);
            alert("Login failed: " + (err.error?.error || "Unknown error"));
          },
        });
      },
      { timeout: 10000 }
    );
  }

  logout() {
    if (!this.empId) {
      alert("Employee ID missing!");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.attendanceService.logout(this.empId!, coords).subscribe({
          next: (res: any) => {
            alert(res.message);
            this.loadAttendance();
          },
          error: (err: any) => {
            console.error("Logout error:", err);
            alert("Logout failed: " + (err.error?.error || "Unknown error"));
          },
        });
      },
      (err) => {
        console.warn("Geolocation error:", err);
        const fallback = { lat: 16.972499, lng: 82.240390 };
        this.attendanceService.logout(this.empId!, fallback).subscribe({
          next: (res: any) => {
            alert("Location denied, using fallback coords.\n" + res.message);
            this.loadAttendance();
          },
          error: (err: any) => {
            console.error("Logout error:", err);
            alert("Logout failed: " + (err.error?.error || "Unknown error"));
          },
        });
      },
      { timeout: 10000 }
    );
  }


  loadAttendance() {
    if (!this.empId) return;

    this.attendanceService.listByEmp(this.empId).subscribe({
      next: (data: any[]) => {
        const todayStr = formatDate(new Date(), "yyyy-MM-dd", "en-US"); // today's date in YYYY-MM-DD
        this.attendanceList = data.filter((row: any) => {
          const rowDate = formatDate(new Date(row.date), "yyyy-MM-dd", "en-US");
          return rowDate === todayStr;
        });
      },
      error: (err: any) => console.error("Fetch error:", err),
    });
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
    return formatDate(dt, 'd MMM y', 'en-US');
  }
}
