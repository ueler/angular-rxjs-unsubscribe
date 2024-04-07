import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-timer-complete',
  templateUrl: './rxjs-timer-complete.component.html',
  styleUrls: ['./rxjs-timer-complete.component.scss']
})
export class RxjsTimerCompleteComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;

  counter = 0;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.subscription = timer(0, 1000)
      .pipe(take(5))
      .subscribe(() => {
        this.counter++;
        this.titleService.setTitle('Counter ' + this.counter);
      });
  }

  ngOnDestroy() {
    // Avoid side effects by unsubscribing:
    this.subscription.unsubscribe();
  }
}
