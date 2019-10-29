import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterParamMapComponent } from './router-param-map.component';

describe('RouterParamMapComponent', () => {
  let component: RouterParamMapComponent;
  let fixture: ComponentFixture<RouterParamMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterParamMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterParamMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
