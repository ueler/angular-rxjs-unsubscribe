import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UntilDestroyedComponent } from './until-destroyed.component';

describe('UntilDestroyedComponent', () => {
  let component: UntilDestroyedComponent;
  let fixture: ComponentFixture<UntilDestroyedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UntilDestroyedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UntilDestroyedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
