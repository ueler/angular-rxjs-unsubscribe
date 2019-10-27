import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeUntilComponent } from './take-until.component';

describe('TakeUntilComponent', () => {
  let component: TakeUntilComponent;
  let fixture: ComponentFixture<TakeUntilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeUntilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeUntilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
