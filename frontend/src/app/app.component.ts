// app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AttendanceService } from './services/attendance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {

  }

  hideNavbar(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return hiddenRoutes.includes(this.router.url);
  }
}
