import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-take-until',
  templateUrl: './take-until.component.html',
  styleUrls: ['./take-until.component.scss']
})
export class TakeUntilComponent implements OnInit, OnDestroy {

  private readonly ngDestroy = new Subject();

  private everySecond = timer(0, 1000);
  private everyThirdSecond = timer(0, 3000);

  constructor() {
  }

  ngOnInit() {
    this.everySecond.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        // some logic here
      });

    this.everyThirdSecond.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        // some logic here
      });
  }

  ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }


}
