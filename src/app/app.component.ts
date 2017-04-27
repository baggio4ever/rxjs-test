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
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/distinctUntilChanged';

/*
  ここのサイトで勉強中
    https://tech.recruit-mp.co.jp/front-end/post-11475/

*/

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
  subscription;
  mergeFes;

  subCold;
  subscriptionCold;
  XX=0;

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

    const numB = Observable.from( [97,98,99,100,101] )
                  .do( val=>console.error('do1:'+val) )
                  .map( val=>{return val*10;})
                  .do( val=>console.error('do2:'+val) );
    const strS = Observable.from( 'Say,Hello! 日本語だって大丈夫そう！' );
    this.numbers = Observable.of( 5,4,3,2,1 ).delay(2000).concat(numB.delay(1000)).concat(strS.delay(1000));

    this.intervalStream = Observable.interval(1000);

    let abc = Observable.fromEvent( document.querySelector('.abc'),'click');
    let xyz = Observable.fromEvent( document.querySelector('.xyz'),'click');
    Observable.merge( abc.mapTo('エービーシー'),xyz.mapTo('エックスワイゼット'))
      .distinctUntilChanged()
      .subscribe( val=>{
        console.log(val);
        this.messages.push(val);
      });

    // aaa と bbb の中身をきれいに混在させる方法ってあるのかしら。mergeではうまくいかない。concatと同じ結果になっちゃう
    let aaa = Observable.from([1,1,1,1,1,1,1,1,1,1]);
    let bbb = Observable.from([2,2,2,2,2,2,2,2,2,2]);
    this.mergeFes = Observable.merge(aaa,bbb);

    this.subCold = Observable.fromEvent( document.querySelector('.cold_btn'),'click')
        .do( v=>{this.XX++;} )
        .map( (ev:MouseEvent)=>ev.type+' '+this.XX );
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
    this.subscription = this.intervalStream.subscribe(
      (x)=>{console.info(x);},
      (error:Error)=>{console.info('Error!!');},
      ()=>{console.info('<<<<< Completed >>>>>');}
    );
  }
  onStopInterval(){
    console.warn('STOP!');
    this.subscription.unsubscribe();
  }

  onMergeFes(){
    this.mergeFes.subscribe( val => {
      console.info(val);
    })
  }

  onSumSum(){
    let sum = Observable.from([1,2,3,4,5,6,7,8,9,10]).scan( (acc,cur)=> acc+cur,0 );

    sum.subscribe(
      (val) => { this.messages.push( '途中までの合計は '+val+' です' ); },
      (error:Error)=>{this.messages.push('ERROR!');},
      ()=>{ this.messages.push('==== completed ====');}
    );
  }

  onTake(){
    console.log('begin onTake()');

    Observable.interval(1000)
      .skip(3)
      .take(5)
      .subscribe(
        (v)=>{console.log('take '+v);},
        (error:Error)=>{console.log('ERROR!!');},
        ()=>{console.log('++++ completed ++++');}
      );

    console.log('end onTake()');
  }

  onSubscribe(){
    this.subscriptionCold = this.subCold.subscribe(val => this.messages.push('COLD: '+val));
  }
  onUnsubscribe(){
    this.subscriptionCold.unsubscribe();
  }
}
