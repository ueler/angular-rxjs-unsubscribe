import {Component} from '@angular/core';
import {timer} from 'rxjs';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-until-destroyed',
  templateUrl: './take-until-destroyed.component.html',
  styleUrls: ['./take-until-destroyed.component.scss']
})
export class TakeUntilDestroyedComponent {

  private everySecond$ = timer(0, 1000);
  private everyThirdSecond$ = timer(0, 3000);

  constructor() {
    this.everySecond$.pipe(takeUntilDestroyed())
      .subscribe(() => {
        console.log("TakeUntilDestroyedComponent everySecond$ emitted");
        // some logic here
      });

    this.everyThirdSecond$.pipe(takeUntilDestroyed())
      .subscribe(() => {
        console.log("TakeUntilDestroyedComponent everyThirdSecond$ emitted");
        // some logic here
      });
  }
}
