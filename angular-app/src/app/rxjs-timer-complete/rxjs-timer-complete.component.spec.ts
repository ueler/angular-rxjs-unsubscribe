import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsTimerCompleteComponent } from './rxjs-timer-complete.component';

describe('RxjsTimerCompleteComponent', () => {
  let component: RxjsTimerCompleteComponent;
  let fixture: ComponentFixture<RxjsTimerCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxjsTimerCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsTimerCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
