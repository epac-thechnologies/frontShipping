import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLabelComponent } from './security-label.component';

describe('SecurityLabelComponent', () => {
  let component: SecurityLabelComponent;
  let fixture: ComponentFixture<SecurityLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
