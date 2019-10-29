import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmptyComponent} from './empty/empty.component';
import {RxjsTimerComponent} from './rxjs-timer/rxjs-timer.component';
import {
  PATH_EMPTY,
  PATH_HTTP_CLIENT,
  PATH_ROUTER_EVENTS,
  PATH_ROUTER_PARAM_MAP,
  PATH_RXJS_TIMER,
  PATH_RXJS_TIMER_COMPLETE
} from './routing-links';
import {RxjsTimerCompleteComponent} from './rxjs-timer-complete/rxjs-timer-complete.component';
import {HttpclientComponent} from './httpclient/httpclient.component';
import {RouterParamMapComponent} from './router-param-map/router-param-map.component';
import {RouterEventsComponent} from './router-events/router-events.component';


const routes: Routes = [
  {path: PATH_EMPTY, component: EmptyComponent},
  {path: PATH_RXJS_TIMER, component: RxjsTimerComponent},
  {path: PATH_RXJS_TIMER_COMPLETE, component: RxjsTimerCompleteComponent},
  {path: PATH_HTTP_CLIENT, component: HttpclientComponent},
  {path: PATH_ROUTER_PARAM_MAP, component: RouterParamMapComponent},
  {path: PATH_ROUTER_PARAM_MAP + '/:param', component: RouterParamMapComponent},
  {path: PATH_ROUTER_EVENTS, component: RouterEventsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
