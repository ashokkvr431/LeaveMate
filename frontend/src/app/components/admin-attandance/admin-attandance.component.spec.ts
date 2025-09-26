import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAttandanceComponent } from './admin-attandance.component';

describe('AdminAttandanceComponent', () => {
  let component: AdminAttandanceComponent;
  let fixture: ComponentFixture<AdminAttandanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAttandanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAttandanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
