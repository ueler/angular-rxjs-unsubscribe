import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmptyComponent} from './empty/empty.component';
import {RxjsTimerComponent} from './rxjs-timer/rxjs-timer.component';
import {PATH_EMPTY, PATH_HTTP_CLIENT, PATH_RXJS_TIMER, PATH_RXJS_TIMER_COMPLETE} from './routing-links';
import {RxjsTimerCompleteComponent} from './rxjs-timer-complete/rxjs-timer-complete.component';
import {HttpclientComponent} from './httpclient/httpclient.component';


const routes: Routes = [
  {path: PATH_EMPTY, component: EmptyComponent},
  {path: PATH_RXJS_TIMER, component: RxjsTimerComponent},
  {path: PATH_RXJS_TIMER_COMPLETE, component: RxjsTimerCompleteComponent},
  {path: PATH_HTTP_CLIENT, component: HttpclientComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
