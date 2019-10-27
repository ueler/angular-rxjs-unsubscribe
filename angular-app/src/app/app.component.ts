import {Component} from '@angular/core';
import {RoutingLinks} from './routing-links';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  RoutingLinks = RoutingLinks;

  title = 'angular-app';
}
