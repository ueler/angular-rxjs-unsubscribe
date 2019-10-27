import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatherSubscriptionsComponent } from './gather-subscriptions.component';

describe('GatherSubscriptionsComponent', () => {
  let component: GatherSubscriptionsComponent;
  let fixture: ComponentFixture<GatherSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatherSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatherSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
