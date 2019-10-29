import {Component, OnInit} from '@angular/core';
import {Event, Router} from '@angular/router';

@Component({
  selector: 'app-router-events',
  templateUrl: './router-events.component.html',
  styleUrls: ['./router-events.component.scss']
})
export class RouterEventsComponent implements OnInit {

  event: Event;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      console.log('routerEvent', event);
      this.event = event;
    });
  }

}
