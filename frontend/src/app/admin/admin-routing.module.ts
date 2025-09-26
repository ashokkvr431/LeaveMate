import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { AdminPendingApprovalsComponent } from '../components/admin-pending-approvals/admin-pending-approvals.component';
import { AdminAttandanceComponent } from '../components/admin-attandance/admin-attandance.component';
import { AdminLeaveApprovedComponent } from '../components/admin-leave-approved/admin-leave-approved.component';
import { AdminLeaveRejectedComponent } from '../components/admin-leave-rejected/admin-leave-rejected.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { ProfileEditComponent } from '../components/profile-edit/profile-edit.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'pending', component: AdminPendingApprovalsComponent },
  { path: 'attendance', component: AdminAttandanceComponent },
  { path: 'leave/approved', component: AdminLeaveApprovedComponent },
  { path: 'leave/rejected', component: AdminLeaveRejectedComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/edit', component: ProfileEditComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
