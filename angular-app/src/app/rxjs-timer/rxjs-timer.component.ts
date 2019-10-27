import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-rxjs-timer',
  templateUrl: './rxjs-timer.component.html',
  styleUrls: ['./rxjs-timer.component.scss']
})
export class RxjsTimerComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  counter = 0;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.subscription = timer(0, 1000)
      .subscribe(() => {
        this.counter++;
        this.titleService.setTitle('Counter ' + this.counter);
      });
  }

  ngOnDestroy() {
    // Avoid side effects and memory leak by unsubscribing:
    this.subscription.unsubscribe();
  }

}
