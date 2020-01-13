import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-httpclient',
  templateUrl: './httpclient.component.html',
  styleUrls: ['./httpclient.component.scss']
})
export class HttpclientComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  title: string;

  constructor(private httpClient: HttpClient,
              private titleService: Title) {
  }

  ngOnInit() {
    this.subscription = this.httpClient.get<ApiResponse>('/api').subscribe((result) => {
      this.title = result.title;
      this.titleService.setTitle(result.title);
    });
  }

  ngOnDestroy() {
    // Avoid side effects by unsubscribing:
    this.subscription.unsubscribe();
  }

}

class ApiResponse {
  title: string;
}
