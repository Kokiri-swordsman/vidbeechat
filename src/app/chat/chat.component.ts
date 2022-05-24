import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
// import { Directive, HostListener } from '@angular/core';
import { Observable, of } from "rxjs";
import { DataService } from '../data.service';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../user';
import { Message } from '../message';


// @Directive({
//   selector: '[scroller]'
// })
// export class ScrollerDirective {

//   @HostListener('scroll', ['$event']) private onScroll($event:Event):void {
//     console.log("scroll");
//   };

//   // @HostListener('scroll') scrolling(){
//   //   console.log('scrolling');
//   // }

//   // @HostListener('click') clicking(){
//   //   console.log('clicking...');
//   // }

//   constructor() { }

// }


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  @Input() user?: User;
  @Input() message?: String;
  @Input() service?: DataService;
  @Input() messages?: Message[] = [];
  // @Output() requestMessages: EventEmitter<User> = new EventEmitter();
  @ViewChild('scrollArea') scrollArea: ElementRef<HTMLInputElement>;

  liveData$ = this.service?.messages$.pipe(
    // map(rows => rows.data.sort((a: Message, b: Message) => {
    //   a.time < b.time
    // })),
    map(rows => rows.data),
    catchError(error => { throw error }),
    tap({
      error: error => console.log('[Live component] Error:', error),
      complete: () => console.log('[Live component] Connection Closed')
    })
  );

  

  constructor() {
  // constructor(private service: DataService) {
    // this.service.connect();
    // this.service.sendMessage("connect");
    // console.log("connect");
  }

  ngOnInit(): void {

  }

  send() {
    // console.log(this.message);
    this.service?.sendMessage(this.message, this.user!);
    // this.service.sendMessage("test");
    this.message = "";

  }

  findEarliestMessage() {
    let date = Date.now();
    // date.to
    // let date = new Date();
    this.messages?.forEach(m => {
      let date2 = Date.parse(m.time);
      if (date2 < date) {
        date = date2;
      }
    });
    return new Date(date).toISOString();
  }

  scroll() {
    console.log("scroll");
    // console.log(this.findEarliestMessage());
    // console.log(this.scrollArea.nativeElement.scrollTop);
    console.log(this.scrollArea?.nativeElement.scrollTop);
    if (this.scrollArea?.nativeElement.scrollTop == 0) {
      this.service?.requestMessages(this.findEarliestMessage());
    }
  }

}
