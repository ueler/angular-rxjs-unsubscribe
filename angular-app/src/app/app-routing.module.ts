import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmptyComponent} from './empty/empty.component';
import {RxjsTimerComponent} from './rxjs-timer/rxjs-timer.component';
import {
  PATH_COMPONENT_TREE,
  PATH_EMPTY,
  PATH_HTTP_CLIENT,
  PATH_ROUTER_EVENTS,
  PATH_ROUTER_PARAM_MAP,
  PATH_RXJS_TIMER,
  PATH_RXJS_TIMER_COMPLETE, PATH_UNSUBSCRIPTION_ASYNC_PIPE,
  PATH_UNSUBSCRIPTION_GATHER,
  PATH_UNSUBSCRIPTION_TAKE_UNTIL, PATH_UNSUBSCRIPTION_TAKE_UNTIL_DESTROYED,
  PATH_UNSUBSCRIPTION_UNTIL_DESTROYED
} from './routing-links';
import {RxjsTimerCompleteComponent} from './rxjs-timer-complete/rxjs-timer-complete.component';
import {HttpclientComponent} from './httpclient/httpclient.component';
import {RouterParamMapComponent} from './router-param-map/router-param-map.component';
import {RouterEventsComponent} from './router-events/router-events.component';
import {ComponentTreeComponent} from './component-tree/component-tree.component';
import {
  GatherSubscriptionsComponent
} from "./unsubscription-methods/gather-subscriptions/gather-subscriptions.component";
import {TakeUntilComponent} from "./unsubscription-methods/take-until/take-until.component";
import {UntilDestroyedComponent} from "./unsubscription-methods/until-destroyed/until-destroyed.component";
import {
  TakeUntilDestroyedComponent
} from "./unsubscription-methods/take-until-destroyed/take-until-destroyed.component";
import {AsyncPipeComponent} from "./unsubscription-methods/async-pipe/async-pipe.component";


const routes: Routes = [
  {path: PATH_EMPTY, component: EmptyComponent},
  {path: PATH_RXJS_TIMER, component: RxjsTimerComponent},
  {path: PATH_RXJS_TIMER_COMPLETE, component: RxjsTimerCompleteComponent},
  {path: PATH_HTTP_CLIENT, component: HttpclientComponent},
  {path: PATH_ROUTER_PARAM_MAP, component: RouterParamMapComponent},
  {path: PATH_ROUTER_PARAM_MAP + '/:param', component: RouterParamMapComponent},
  {path: PATH_ROUTER_EVENTS, component: RouterEventsComponent},
  {path: PATH_COMPONENT_TREE, component: ComponentTreeComponent},
  {path: PATH_UNSUBSCRIPTION_GATHER, component: GatherSubscriptionsComponent},
  {path: PATH_UNSUBSCRIPTION_TAKE_UNTIL, component: TakeUntilComponent},
  {path: PATH_UNSUBSCRIPTION_UNTIL_DESTROYED, component: UntilDestroyedComponent},
  {path: PATH_UNSUBSCRIPTION_TAKE_UNTIL_DESTROYED, component: TakeUntilDestroyedComponent},
  {path: PATH_UNSUBSCRIPTION_ASYNC_PIPE, component: AsyncPipeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
