import { Component,VERSION,AfterViewInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
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
import 'rxjs/add/operator/publish';
//import 'rxjs/add/observable/connect';

/*
  ここのサイトで勉強中
    https://tech.recruit-mp.co.jp/front-end/post-11475/

*/

class LogItem {
  constructor(public msg:string,public time:Date){}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'RxJS の勉強場';

  angular_version = VERSION.full;

  messages = [];
  n=0;
  numbers;
  doonSubscription;

  intervalStream;
  subscription;
  mergeFes;

  subCold;
  subscriptionCold;
  XX=0;

  subHot;
  subscriptionHot;
  subscriptionHot2;
  YY=0;

  subject;
  msgText="";

  addMessage( aMsg:string ):void {
    let anObj:LogItem = new LogItem(aMsg,new Date());
    this.messages.push(anObj);
  }

  ngAfterViewInit() {
    const button = document.querySelector('.xxy');
    let first = Observable
      .fromEvent( button,'click' );
    let second = Observable
      .fromEvent( button,'dblclick');
    
    Observable.merge(first,second)  // 2つのObservableを合流
      .subscribe( (event:MouseEvent)=>{
          this.n++;
          const s = (event.target as HTMLButtonElement).textContent +' is clicked. '+event.type+' '+this.n;

          this.addMessage(s);
      });


    const numB = Observable.from( [97,98,99,100,101] )
                  .do( val=>console.error('do1:'+val) )
                  .map( val=>{return val*10;})  // ここで10倍
                  .do( val=>console.error('do2:'+val) );
    const strS = Observable.from( 'Say,Hello! 日本語だって大丈夫そう！' ); // なぜか2回目以降のsubscribeでは、この日本語が流れてこない。不思議
    this.numbers = Observable.of( 5,4,3,2,1 )
                  .delay(2000)
                  .concat(strS.delay(3000))
                  .concat(numB.delay(1000));


    this.intervalStream = Observable.interval(1000);

    let abc = Observable.fromEvent( document.querySelector('.abc'),'click');
    let xyz = Observable.fromEvent( document.querySelector('.xyz'),'click');
    Observable.merge( abc.mapTo('エービーシー'),xyz.mapTo('エックスワイゼット'))
      .distinctUntilChanged() // 同じ値は無視
      .subscribe( val=>{
        this.addMessage(val);
      });

    // aaa と bbb の中身をきれいに混在させる方法ってあるのかしら。mergeではうまくいかない。concatと同じ結果になっちゃう
    let aaa = Observable.from([1,1,1,1,1,1,1,1,1,1]);
    let bbb = Observable.from([2,2,2,2,2,2,2,2,2,2]);
    this.mergeFes = Observable.merge(aaa,bbb);

    this.subCold = Observable.fromEvent( document.querySelector('.cold_btn'),'click')
        .do( v=>{this.XX++; console.info('do cold: '+this.XX);} )
        .map( (ev:MouseEvent)=>ev.type+' '+this.XX );

    this.subHot = Observable.fromEvent( document.querySelector('.hot_btn'),'click')
        .do( v=>{this.YY++; console.info('do hot: '+this.YY);} )
        .map( (ev:MouseEvent)=>ev.type+' '+this.YY )
        .publish();
    this.subHot.connect();


    const observerA = {
      next: (x)=>{ this.addMessage('A next: '+x);},
      error: (err)=>{ this.addMessage('A error: '+err);},
      complete: ()=>{ this.addMessage('A ---- completed ----');}
    }
    this.subject = new Subject();
    this.subject.subscribe(observerA);
  }

  onDoon(){
    this.addMessage('どーーん');

    this.doonSubscription = this.numbers.subscribe(
      (x)=>{this.addMessage(x);},
      (error:Error)=>{this.addMessage('Error!');},
      ()=>{this.addMessage('----- completed! -----');}
    );
  }

  onDoonUnsubscribe() {
    this.addMessage('どーーん解除');

    this.doonSubscription.unsubscribe();
  }

  onStartInterval(){
    this.addMessage('START!');

    this.subscription = this.intervalStream.subscribe(
      (x)=>{this.addMessage(x);},
      (error:Error)=>{this.addMessage('Error!!');},
      ()=>{this.addMessage('<<<<< Completed >>>>>');}
    );
  }
  onStopInterval(){
    this.addMessage('STOP!');

    this.subscription.unsubscribe();
  }

  onMergeFes(){
    this.mergeFes.subscribe( val => {
      this.addMessage(val);
    })
  }

  onSumSum(){
    let sum = Observable.from([1,2,3,4,5,6,7,8,9,10]).scan( (acc,cur)=> acc+cur,0 );

    sum.subscribe(
      (val) => { this.addMessage( '途中までの合計は '+val+' です' ); },
      (error:Error)=>{this.addMessage('ERROR!');},
      ()=>{ this.addMessage('==== completed ====');}
    );
  }

  onTake(){
    this.addMessage('begin onTake()');

    Observable.interval(1000)
      .skip(3)
      .take(5)
      .subscribe(
        (v)=>{this.addMessage('take '+v);},
        (error:Error)=>{this.addMessage('ERROR!!');},
        ()=>{this.addMessage('++++ completed ++++');}
      );

    this.addMessage('end onTake()');
  }

  onSubscribe(){
    this.addMessage('COLD: subscribe');
    this.subscriptionCold = this.subCold.subscribe(val => this.addMessage('COLD: '+val));
  }
  onUnsubscribe(){
    this.addMessage('COLD: unsubscribe');
    this.subscriptionCold.unsubscribe();
  }

  onSubscribeHOT(){
    this.addMessage('HOT: subscribe');
    this.subscriptionHot = this.subHot.subscribe(val => this.addMessage('HOT: '+val));
  }
  onUnsubscribeHOT(){
    this.addMessage('HOT: unsubscribe');
    this.subscriptionHot.unsubscribe();
  }
  onSubscribeHOT2(){
    this.addMessage('HOT2: subscribe');
    this.subscriptionHot2 = this.subHot.subscribe(val => this.addMessage('HOT2: '+val));
  }
  onUnsubscribeHOT2(){
    this.addMessage('HOT2: unsubscribe');
    this.subscriptionHot2.unsubscribe();
  }

  onSubjectNext(){
    this.subject.next(this.msgText);
  }

  onClearLog(){
    this.messages = [];
  }
}
