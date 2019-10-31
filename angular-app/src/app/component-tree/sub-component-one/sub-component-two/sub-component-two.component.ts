import {Component, OnInit} from '@angular/core';
import {timer} from 'rxjs';

@Component({
  selector: 'app-sub-component-two',
  templateUrl: './sub-component-two.component.html',
  styleUrls: ['./sub-component-two.component.scss']
})
export class SubComponentTwoComponent implements OnInit {

  counter = 0;

  constructor() {
  }

  ngOnInit() {
    timer(0, 1000)
      .subscribe(() => {
        this.counter++;
      });
  }

}
