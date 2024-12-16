import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarcartComponent } from './navbarcart.component';

describe('NavbarcartComponent', () => {
  let component: NavbarcartComponent;
  let fixture: ComponentFixture<NavbarcartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarcartComponent]
    });
    fixture = TestBed.createComponent(NavbarcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
