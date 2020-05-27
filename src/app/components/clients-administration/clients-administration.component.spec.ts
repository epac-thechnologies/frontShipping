import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsAdministrationComponent } from './clients-administration.component';

describe('ClientsAdministrationComponent', () => {
  let component: ClientsAdministrationComponent;
  let fixture: ComponentFixture<ClientsAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
