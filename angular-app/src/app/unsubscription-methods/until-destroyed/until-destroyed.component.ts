import {Component, OnDestroy, OnInit} from '@angular/core';
import {timer} from 'rxjs';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-until-destroyed',
  templateUrl: './until-destroyed.component.html',
  styleUrls: ['./until-destroyed.component.scss']
})
export class UntilDestroyedComponent implements OnInit, OnDestroy {

  private everySecond = timer(0, 1000);
  private everyThirdSecond = timer(0, 3000);

  constructor() {
  }

  ngOnInit() {
    this.everySecond.pipe(untilDestroyed(this))
      .subscribe(() => {
        // some logic here
      });

    this.everyThirdSecond.pipe(untilDestroyed(this))
      .subscribe(() => {
        // some logic here
      });
  }

  ngOnDestroy() {
    // needed for untilDestroyed
  }
}
