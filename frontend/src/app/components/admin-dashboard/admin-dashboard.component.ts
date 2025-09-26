import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  today = new Date().toISOString().slice(0, 10);
  pendingApprovals: number = 0;
  approvedLeaves: number = 0;
  rejectedLeaves: number = 0;

  constructor(public authService: AuthService, private leaveService: LeaveService) {}

  ngOnInit() {
    if (this.authService.isAdmin()) {
      this.loadPendingApprovals();
      this.loadApprovedLeaves();
      this.loadRejectedLeaves();
    }
  }

  loadPendingApprovals() {
    this.leaveService.adminApprovals().subscribe({
      next: (res: any[]) => {
        this.pendingApprovals = res.length;
      },
      error: (err: any[]) => {
        console.error("Error fetching", err);
      }
    }) 
  }

  loadApprovedLeaves() {
    this.leaveService.getApprovedLeaves().subscribe({
      next: (res: any[]) => {
        this.approvedLeaves = res.length;  
      },
      error: (err: any[]) => {
        console.error("Error fetching", err);
      }
    }) 
  }

  loadRejectedLeaves() {
    this.leaveService.getRejectedLeaves().subscribe({
      next: (res: any[]) => {
        this.rejectedLeaves = res.length;
      },
      error: (err: any[]) => {
        console.error("Error fetching", err);
      }
    })
  }
 
}
