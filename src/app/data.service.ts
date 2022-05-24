import { Injectable, EventEmitter, Output } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { Observable, EMPTY, Subject } from 'rxjs';
import { User } from './user';
import { Message } from './message';
import { map } from 'rxjs/operators';
export const WS_ENDPOINT = 'ws://127.0.0.1:8081';
// export const WS_ENDPOINT = 'ws://localhost:8081';
// export const WS_ENDPOINT = 'ws://149.248.81.235:8081';
// export const WS_ENDPOINT = 'ws://chat.vidbee.space:8081';
// export const WS_ENDPOINT = environment.wsEndpoint;

function sort(value: Observable<Message>) : Observable<Message> {
  return value;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  @Output() userList: EventEmitter<string[]> = new EventEmitter();
  @Output() message: EventEmitter<Message> = new EventEmitter();
  @Output() reject: EventEmitter<Message> = new EventEmitter();

  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<Observable<any>>();
  public messages$ = this.messagesSubject$.pipe(
    switchAll(),
    // map(data => data.sort((a, b) => {a.date < b.date})),
    // tap(data => {
    //   data.sort()
    // }),
    catchError(e => { throw e })
  );
  
  selfUser: User;
  selectedUser?: User;

  public connect(): void {
    console.log("connect");

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      this.socket$.subscribe({
        next: (data) => {
          // console.log(data);
          if (data.type == "userList") {
            // console.log("userList");
            // console.log(data.users);
            this.userList.emit(data.users);
            console.log(this.selfUser.name);
            // this.requestMessages();
            // this.socket$.next({
            //   type: 'getMessages',
            //   from: this.selfUser.name,
            //   to: this.selectedUser
            // });

          } else if (data.type == "message") {
            this.message.emit({
              from: data.from, 
              to: data.to, 
              message: data.message,
              time: data.time
            });
            this.messagesSubject$.next(data);

          } else if (data.type == "messages") {
            console.log("messages");
            console.log(data.messages);
            data.messages?.forEach((data: { fromUser: string; toUser: string; message: string; time: string; }) => {
              this.message.emit({
                from: data.fromUser, 
                to: data.toUser,
                message: data.message,
                time: data.time
              })
            });

          } else if (data.type == "reject") {
            console.log("emit reject");
            this.reject.emit();
          }
        },
        error: console.log,
        complete: () => {}
      });

      // this.register();
    }



    // if (!this.socket$ || this.socket$.closed) {
    //   this.socket$ = this.getNewWebSocket();
    //   const messages = this.socket$.pipe(
    //     tap({
    //       error: error => console.log(error),
    //     }), catchError(_ => EMPTY));
    //   this.messagesSubject$.next(messages);
    // }
  }

  private getNewWebSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      // protocol: 'json',
      // deserializer: (msg) => {msg}
    });
  }

  sendMessage(msg: any, to: User) {
    let date = new Date();
    let sqllite_date = date.toISOString();
    // console.log("sendMessage");
    this.socket$.next({
      type:"message", 
      from: this.selfUser.name, 
      to: to.name, 
      message: msg
    });
    this.message.emit({
      from: this.selfUser.name, 
      to: to.name, 
      message: msg,
      time: sqllite_date
    });
  }

  requestMessages(time: string) {
    console.log("selfuser: " + this.selfUser.name);
    console.log("selecteduser: " + this.selectedUser?.name);
    console.log("time: " + time);
    this.socket$.next({
      type: 'getMessages',
      from: this.selfUser.name,
      to: this.selectedUser?.name,
      time: time
    });
  }

  login(name: string, pass: string) {
    // if (this.selfUser.name != "") {
      this.socket$.next({type:"login", from: name, pass: pass});
    // }
  }

  register(name: string, pass: string) {
    // if (this.selfUser.name != "") {
      this.socket$.next({type:"register", from: name, pass: pass});
    // }
  }

  close() {
    this.socket$.complete();
  }

  constructor() {
    // this.selfUser = user;
  }
}
