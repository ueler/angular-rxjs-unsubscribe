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

@NgModule({
  declarations: [
    AppComponent,
    RxjsTimerComponent,
    EmptyComponent,
    RxjsTimerCompleteComponent,
    HttpclientComponent,
    GatherSubscriptionsComponent,
    TakeUntilComponent,
    UntilDestroyedComponent
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
