import { Component } from '@angular/core';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent {
  msg = '';
  err = '';
  totalDays = 0;

  leaveBalance = { sick: 5, casual: 12, earned: 0 };

  form: any = {
    leave_type_id: '',
    duration: 'full',
    start_date: '',
    end_date: '',
    reason: '',
    notes: '',
    file: null
  };

  constructor(private leave: LeaveService) { }

  updateDays() {
    if (this.form.start_date && this.form.end_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize today (ignore time)

      const start = new Date(this.form.start_date);
      const end = new Date(this.form.end_date);

      // Reset time part for comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (start < today) {
        this.totalDays = 0;
        this.err = 'Start date cannot be in the past';
        return;
      }

      if (end < start) {
        this.totalDays = 0;
        this.err = 'End date cannot be before start date';
        return;
      }

      //  Calculate valid days
      const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
      this.totalDays = this.form.duration === 'half' ? 0.5 : diff;
      this.err = '';
    }
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.form.file = input.files[0];
  }

  submit() {
    this.msg = '';
    this.err = '';

    if (!this.form.leave_type_id || !this.form.start_date || !this.form.end_date || !this.form.reason) {
      this.err = 'Please fill all required fields';
      return;
    }
    if (this.totalDays <= 0) {
      this.err = 'Invalid leave duration';
      return;
    }

    const fd = new FormData();
    Object.keys(this.form).forEach(k => {
      if (this.form[k] !== null) fd.append(k, this.form[k]);
    });
    fd.append('days', this.totalDays.toString());

    this.leave.applyLeave(fd).subscribe({
      next: (r: any) => {
        this.msg = r.message || 'Leave applied successfully';
        this.form = { leave_type_id: '', duration: 'full', start_date: '', end_date: '', reason: '', notes: '', file: null };
        this.totalDays = 0;
      },
      error: (e) => this.err = e?.error?.message || 'Failed to apply leave'
    });
  }
}
