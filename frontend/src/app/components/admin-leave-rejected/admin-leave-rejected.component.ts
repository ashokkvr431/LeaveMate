import { Component } from '@angular/core';
import { LeaveService } from 'src/app/services/leave.service';

@Component({
  selector: 'app-admin-leave-rejected',
  templateUrl: './admin-leave-rejected.component.html',
  styleUrls: ['./admin-leave-rejected.component.scss']
})
export class AdminLeaveRejectedComponent {
  rows: any[] = [];
  err = '';

  constructor(private leave: LeaveService) {}

  ngOnInit() {
    this.leave.getRejectedLeaves().subscribe({
      next: (r) => this.rows = r || [],
      error: (e) => this.err = e?.error?.message || 'Failed to load rejected leaves'
    });
  }
}
