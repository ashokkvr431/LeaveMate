import { Component } from '@angular/core';
import { LeaveService } from 'src/app/services/leave.service';

@Component({
  selector: 'app-admin-pending-approvals',
  templateUrl: './admin-pending-approvals.component.html',
  styleUrl: './admin-pending-approvals.component.scss'
})
export class AdminPendingApprovalsComponent {
  rows: any[] = [];
    msg = '';
    err = '';
  
    constructor(private leave: LeaveService) {}
  
    ngOnInit() {
      this.load();
    }
  
    load() {
      this.leave.adminApprovals().subscribe({
        next: (r) => this.rows = r || [],
        error: (e) => this.err = e?.error?.message || 'Failed to load approvals'
      });
    }
  
    act(id: number, status: 'approved' | 'rejected') {
      this.msg = '';
      this.err = '';
      this.leave.updateApproval(id, status).subscribe({
        next: (r: any) => {
          this.msg = r.message || 'Updated successfully';
          this.load();
        },
        error: (e) => this.err = e?.error?.message || 'Failed to update'
      });
    }
  
    calcDays(start: string, end: string) {
      if (!start || !end) return 1;
      const d1 = new Date(start).getTime();
      const d2 = new Date(end).getTime();
      return Math.max(Math.round((d2 - d1) / (1000 * 3600 * 24)) + 1, 1);
    }
}
