import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingSlipsComponent } from './packing-slips.component';

describe('PackingSlipsComponent', () => {
  let component: PackingSlipsComponent;
  let fixture: ComponentFixture<PackingSlipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingSlipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingSlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
