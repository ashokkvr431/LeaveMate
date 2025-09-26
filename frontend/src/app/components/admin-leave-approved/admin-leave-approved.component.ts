import { Component } from '@angular/core';
import { LeaveService } from 'src/app/services/leave.service';

@Component({
  selector: 'app-admin-leave-approved',
  templateUrl: './admin-leave-approved.component.html',
  styleUrls: ['./admin-leave-approved.component.scss']
})
export class AdminLeaveApprovedComponent {
  rows: any[] = [];
  err = '';

  constructor(private leave: LeaveService) {}

  ngOnInit() {
    this.leave.getApprovedLeaves().subscribe({
      next: (r) => this.rows = r || [],
      error: (e) => this.err = e?.error?.message || 'Failed to load approved leaves'
    });
  }
}
