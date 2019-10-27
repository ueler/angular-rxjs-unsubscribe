import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-gather-subscriptions',
  templateUrl: './gather-subscriptions.component.html',
  styleUrls: ['./gather-subscriptions.component.scss']
})
export class GatherSubscriptionsComponent implements OnInit, OnDestroy {

  private readonly subscription = new Subscription();

  everySecond = timer(0, 1000);
  everyThirdSecond = timer(0, 3000);

  constructor() {
  }

  ngOnInit() {
    this.subscription.add(this.everySecond.subscribe(() => {
      // some logic here
    }));
    this.subscription.add(this.everyThirdSecond.subscribe(() => {
      // some logic here
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
