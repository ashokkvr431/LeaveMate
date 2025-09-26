import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeaveRejectedComponent } from './admin-leave-rejected.component';

describe('AdminLeaveRejectedComponent', () => {
  let component: AdminLeaveRejectedComponent;
  let fixture: ComponentFixture<AdminLeaveRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeaveRejectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLeaveRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
