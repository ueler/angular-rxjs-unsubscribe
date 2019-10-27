import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsTimerComponent } from './rxjs-timer.component';

describe('RxjsTimerComponent', () => {
  let component: RxjsTimerComponent;
  let fixture: ComponentFixture<RxjsTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxjsTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
