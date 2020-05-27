import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingAdministrationComponent } from './packaging-administration.component';

describe('PackagingAdministrationComponent', () => {
  let component: PackagingAdministrationComponent;
  let fixture: ComponentFixture<PackagingAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
