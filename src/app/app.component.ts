import { Component,AfterViewInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'RxJS の勉強場';

  messages = [];
  n=0;
  numbers;
  intervalStream;
  suscription;

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

    const numB = Observable.from( [97,98,99,100,101] ).map( val=>{return val*10;});
    const strS = Observable.from( 'Say,Hello! 日本語だって大丈夫そう！' );
    this.numbers = Observable.of( 5,4,3,2,1 ).delay(2000).concat(numB.delay(1000)).concat(strS.delay(1000));

    this.intervalStream = Observable.interval(1000);

    let abc = Observable.fromEvent( document.querySelector('.abc'),'click');
    let xyz = Observable.fromEvent( document.querySelector('.xyz'),'click');
    Observable.merge( abc.mapTo('エービーシー'),xyz.mapTo('エックスワイゼット')).subscribe( val=>{
      console.log(val);
      this.messages.push(val);
    })
  }

  onDoon(){
    console.info('どーーん');
    this.messages.push('どーーん');


    this.numbers.subscribe(
      (x)=>{console.log(x);},
      (error:Error)=>{console.log('Error!');},
      ()=>{console.log('--------- completed! -------');}
    );
  }

  onStartInterval(){
    console.warn('START!');
    this.suscription = this.intervalStream.subscribe(
      (x)=>{console.info(x);},
      (error:Error)=>{console.info('Error!!');},
      ()=>{console.info('<<<<< Completed >>>>>');}
    );
  }
  onStopInterval(){
    console.warn('STOP!');
    this.suscription.unsubscribe();
  }
}
