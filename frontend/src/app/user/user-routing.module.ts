import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LeaveRequestComponent } from '../components/leave-request/leave-request.component';
import { MyLeavesComponent } from '../components/my-leaves/my-leaves.component';
import { AttendanceMarkComponent } from '../components/attendance-mark/attendance-mark.component';
import { AttendanceListComponent } from '../components/attendance-list/attendance-list.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'leave/apply', component: LeaveRequestComponent },
  { path: 'leave/my', component: MyLeavesComponent },
  { path: 'attendance/mark', component: AttendanceMarkComponent },
  { path: 'attendance/list', component: AttendanceListComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]  
})
export class UserRoutingModule {}
