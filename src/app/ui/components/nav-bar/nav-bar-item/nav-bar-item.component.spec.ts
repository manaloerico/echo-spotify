import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarItemComponent } from './nav-bar-item.component';

describe('NavBarItemComponent', () => {
  let component: NavBarItemComponent;
  let fixture: ComponentFixture<NavBarItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavBarItemComponent]
    });
    fixture = TestBed.createComponent(NavBarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
