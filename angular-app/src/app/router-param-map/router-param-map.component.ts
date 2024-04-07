import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-router-param-map',
  templateUrl: './router-param-map.component.html',
  styleUrls: ['./router-param-map.component.scss']
})
export class RouterParamMapComponent implements OnInit, OnDestroy {

  paramMap?: ParamMap;
  queryParamMap?: ParamMap;

  constructor(private activatedRoute: ActivatedRoute,
              private titleService: Title) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.paramMap = paramMap;
      this.titleService.setTitle(paramMap.get('param') ?? "param undefined");
    });
    this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      this.queryParamMap = queryParamMap;
      this.titleService.setTitle(queryParamMap.get('queryParam') ?? "queryParam undefined");
    });
  }

  ngOnDestroy() {
  }

}
