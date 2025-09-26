import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeaveApprovedComponent } from './admin-leave-approved.component';

describe('AdminLeaveApprovedComponent', () => {
  let component: AdminLeaveApprovedComponent;
  let fixture: ComponentFixture<AdminLeaveApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeaveApprovedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLeaveApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
