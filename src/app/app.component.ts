import { Component,AfterViewInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/concat';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app works!';

  messages = [];
  n=0;
  numbers;

  ngAfterViewInit() {
    const button = document.querySelector('.xxy');
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

    const numB = Observable.of( 99,98,99,100 );
    this.numbers = Observable.of( 5,4,3,2,1 ).delay(2000).concat(numB.delay(1000));
  }

  onDoon(){
    console.info('どーーん');
    this.messages.push('どーーん');


    this.numbers.subscribe(
      (x)=>{console.log(x);},
      (error:Error)=>{console.log('Error!');},
      ()=>{console.log('--------- completed! -------');}
    )
  }
}
