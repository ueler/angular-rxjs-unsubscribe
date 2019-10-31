import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubComponentTwoComponent } from './sub-component-two.component';

describe('SubComponentTwoComponent', () => {
  let component: SubComponentTwoComponent;
  let fixture: ComponentFixture<SubComponentTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubComponentTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubComponentTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
