import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-my-leaves',
  templateUrl: './my-leaves.component.html',
  styleUrls: ['./my-leaves.component.scss']
})
export class MyLeavesComponent implements OnInit {
  rows: any[] = [];

  constructor(private leave: LeaveService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.leave.myLeaves().subscribe(r => this.rows = r || []);
  }

  calcDays(a: string, b: string) {
    if (!a || !b) return 1;
    const d1 = new Date(a).getTime(), d2 = new Date(b).getTime();
    const days = Math.round((d2 - d1) / 86400000) + 1;
    return Math.max(days, 1);
  }
}
