import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RxjsTimerComponent } from './rxjs-timer/rxjs-timer.component';
import { EmptyComponent } from './empty/empty.component';
import { RxjsTimerCompleteComponent } from './rxjs-timer-complete/rxjs-timer-complete.component';
import { HttpclientComponent } from './httpclient/httpclient.component';
import {HttpClientModule} from '@angular/common/http';
import { GatherSubscriptionsComponent } from './unsubscription-methods/gather-subscriptions/gather-subscriptions.component';
import { TakeUntilComponent } from './unsubscription-methods/take-until/take-until.component';
import { UntilDestroyedComponent } from './unsubscription-methods/until-destroyed/until-destroyed.component';
import { RouterParamMapComponent } from './router-param-map/router-param-map.component';
import { RouterEventsComponent } from './router-events/router-events.component';
import { ComponentTreeComponent } from './component-tree/component-tree.component';
import { SubComponentOneComponent } from './component-tree/sub-component-one/sub-component-one.component';
import { SubComponentTwoComponent } from './component-tree/sub-component-one/sub-component-two/sub-component-two.component';

@NgModule({
  declarations: [
    AppComponent,
    RxjsTimerComponent,
    EmptyComponent,
    RxjsTimerCompleteComponent,
    HttpclientComponent,
    GatherSubscriptionsComponent,
    TakeUntilComponent,
    UntilDestroyedComponent,
    RouterParamMapComponent,
    RouterEventsComponent,
    ComponentTreeComponent,
    SubComponentOneComponent,
    SubComponentTwoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
