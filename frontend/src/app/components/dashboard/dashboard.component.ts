import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  qrData = '';
  today = new Date().toISOString().slice(0, 10);

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const empId = user?.empId || '';

    this.qrData = JSON.stringify({
      empId: empId,
      log_date: this.today,
      token: localStorage.getItem('token')
    });
  }
}
