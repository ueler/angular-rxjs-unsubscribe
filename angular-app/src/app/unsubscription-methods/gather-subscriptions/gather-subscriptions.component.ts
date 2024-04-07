import {Component, OnDestroy} from '@angular/core';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-gather-subscriptions',
  templateUrl: './gather-subscriptions.component.html',
  styleUrls: ['./gather-subscriptions.component.scss']
})
export class GatherSubscriptionsComponent implements OnDestroy {

  private readonly subscription = new Subscription();

  private everySecond$ = timer(0, 1000);
  private everyThirdSecond$ = timer(0, 3000);

  constructor() {
    this.subscription.add(this.everySecond$.subscribe(() => {
      console.log("GatherSubscriptionsComponent everySecond$ emitted");
      // some logic here
    }));
    this.subscription.add(this.everyThirdSecond$.subscribe(() => {
      console.log("GatherSubscriptionsComponent everyThirdSecond$ emitted");
      // some logic here
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
