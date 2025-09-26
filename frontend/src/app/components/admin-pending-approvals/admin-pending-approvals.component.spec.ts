import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPendingApprovalsComponent } from './admin-pending-approvals.component';

describe('AdminPendingApprovalsComponent', () => {
  let component: AdminPendingApprovalsComponent;
  let fixture: ComponentFixture<AdminPendingApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPendingApprovalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPendingApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
