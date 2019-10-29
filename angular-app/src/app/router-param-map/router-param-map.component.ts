import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-router-param-map',
  templateUrl: './router-param-map.component.html',
  styleUrls: ['./router-param-map.component.scss']
})
export class RouterParamMapComponent implements OnInit, OnDestroy {

  paramMap: any;
  queryParamMap: any;

  constructor(private activatedRoute: ActivatedRoute,
              private titleService: Title) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.paramMap = paramMap;
      this.titleService.setTitle(paramMap.get('param'));
    });
    this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      this.queryParamMap = queryParamMap;
      this.titleService.setTitle(queryParamMap.get('queryParam'));
    });
  }

  ngOnDestroy() {
  }

}
