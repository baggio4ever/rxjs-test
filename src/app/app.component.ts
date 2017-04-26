import { Component,AfterViewInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app works!';

  messages = [];
  n=0;

  ngAfterViewInit() {
    const button = document.querySelector('button');
    let first = Observable
      .fromEvent( button,'click' );
    let second = Observable
      .fromEvent( button,'dblclick');
    
    Observable.merge(first,second)
      .subscribe( (event:MouseEvent)=>{
          this.n++;
          const s = (event.target as HTMLButtonElement).textContent +' is clicked. '+event.type+' '+this.n;
          console.log( s );
          this.messages.push( s );
      });

  }
}
