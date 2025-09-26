// src/app/user/user.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';

import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LeaveRequestComponent } from '../components/leave-request/leave-request.component';
import { MyLeavesComponent } from '../components/my-leaves/my-leaves.component';
import { AttendanceMarkComponent } from '../components/attendance-mark/attendance-mark.component';
import { AttendanceListComponent } from '../components/attendance-list/attendance-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LeaveRequestComponent,
    MyLeavesComponent,
    AttendanceMarkComponent,
    AttendanceListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    ZXingScannerModule,
    QRCodeModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
