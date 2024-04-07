import {Component} from '@angular/core';
import {tap, timer} from 'rxjs';

@Component({
  selector: 'app-until-destroyed',
  templateUrl: './async-pipe.component.html',
  styleUrls: ['./async-pipe.component.scss']
})
export class AsyncPipeComponent {

  everySecond$ = timer(0, 1000).pipe(
    tap(() => console.log("AsyncPipeComponent everySecond$ emitted"))
  );
  everyThirdSecond$ = timer(0, 3000).pipe(
    tap(() => console.log("AsyncPipeComponent everyThirdSecond$ emitted"))
  );

  constructor() {
  }
}
