import {Component, OnDestroy} from '@angular/core';
import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-take-until',
  templateUrl: './take-until.component.html',
  styleUrls: ['./take-until.component.scss']
})
export class TakeUntilComponent implements OnDestroy {

  private readonly ngDestroy = new Subject<void>();

  private everySecond$ = timer(0, 1000);
  private everyThirdSecond$ = timer(0, 3000);

  constructor() {
    this.everySecond$.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        console.log("TakeUntilComponent everySecond$ emitted");
        // some logic here
      });

    this.everyThirdSecond$.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        console.log("TakeUntilComponent everyThirdSecond$ emitted");
        // some logic here
      });
  }

  ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }


}
