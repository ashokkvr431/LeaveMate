// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { AdminAttandanceComponent } from '../components/admin-attandance/admin-attandance.component';
import { AdminLeaveApprovedComponent } from '../components/admin-leave-approved/admin-leave-approved.component';
import { AdminLeaveRejectedComponent } from '../components/admin-leave-rejected/admin-leave-rejected.component';
import { AdminPendingApprovalsComponent } from '../components/admin-pending-approvals/admin-pending-approvals.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminPendingApprovalsComponent,
    AdminAttandanceComponent,
    AdminLeaveApprovedComponent,
    AdminLeaveRejectedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}
