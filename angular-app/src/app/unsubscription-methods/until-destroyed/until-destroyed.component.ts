import {Component} from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {timer} from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-until-destroyed',
  templateUrl: './until-destroyed.component.html',
  styleUrls: ['./until-destroyed.component.scss']
})
export class UntilDestroyedComponent {

  private everySecond$ = timer(0, 1000);
  private everyThirdSecond$ = timer(0, 3000);

  constructor() {
    this.everySecond$.pipe(untilDestroyed(this))
      .subscribe(() => {
        console.log("UntilDestroyedComponent everySecond$ emitted");
        // some logic here
      });

    this.everyThirdSecond$.pipe(untilDestroyed(this))
      .subscribe(() => {
        console.log("UntilDestroyedComponent everyThirdSecond$ emitted");
        // some logic here
      });
  }
}
