import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../user';
// import { Message } from '../message';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Output() selectUser: EventEmitter<User> = new EventEmitter();

  selectedUser?: User;

  @Input() users: User[] = [];
  @Input() ownUser: User;

  constructor() { }

  ngOnInit(): void {

  }

  onSelect(user: User) {
    this.selectedUser = user;
    this.selectUser.emit(this.selectedUser);
  }

}
