import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { User } from './user';
import { Message } from './message';
import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
// import { ChatComponent } from './users/users.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('ChatComponent') chat : ChatComponent;

  title = 'socket-chat';
  selectedUser?: User;
  userNameInput: string = "";
  passInput: string = "";
  ownUser: User = {name:""};
  users: User[] = [];
  messages: Message[] = [];
  service: DataService;

  selectUserHandler(user: User) {
    let date = new Date();
    let sqllite_date = date.toISOString();

    this.selectedUser = user;
    this.service.selectedUser = this.selectedUser;

    console.log("select User: " + this.service.selectedUser?.name);

    this.service.requestMessages(sqllite_date);
  }

  userListHandler(userList: string[]){
    // console.log("userListHandler");
    console.log(userList);
    this.users = [];
    var usrList: User[] = [];
    userList.forEach(name => {
      // console.log("usr = " + name);
      usrList.push({name: name});
    });
    this.users = usrList;
    console.log(this.users);
  }

  messageHandler(message: Message) {
    if (this.messages.findIndex((msg) => {return msg.time === message.time}) == -1) {
      this.messages.push(message);
    }
    this.messages.sort((a, b) => {
      if (a.time < b.time) {
        return -1;
      } else if (a.time > b.time) {
        return 1;
      }
      return 0;
    });
  }

  rejectHandler() {
    console.log("reject login");
    this.ownUser.name="";
    this.userNameInput = "";
    this.passInput = "";
  }

  // requestMessagesHandler() {
  //   console.log("requestMessagesHandler");
  //   this.service.requestMessages(this.ownUser, this.selectedUser);
  // }

  login() {
    this.ownUser.name = this.userNameInput;
    this.service.login(this.userNameInput, this.passInput);
  }

  register() {
    this.ownUser.name = this.userNameInput;
    this.service.register(this.userNameInput, this.passInput);
  }

  filterByUser(): Message[] {
    return this.messages.filter((m) => 
      (m.from == this.selectedUser?.name && m.to == this.ownUser.name) || 
      (m.to == this.selectedUser?.name && m.from == this.ownUser.name)
    );
  }

  constructor(private newService: DataService) {
    newService.selfUser = this.ownUser;
    this.service = newService;
    this.service.selectedUser = this.selectedUser;
    this.service.connect();
    // this.service.register();


    this.service.userList.subscribe((users: string[]) => {this.userListHandler(users)});
    this.service.message.subscribe((message: Message) => {this.messageHandler(message)});
    this.service.reject.subscribe(() => {this.rejectHandler()});
    // this.chat?.requestMessages.subscribe(() => {this.requestMessagesHandler()});
  }
}
