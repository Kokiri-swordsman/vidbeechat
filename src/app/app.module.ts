import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
// import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    ChatComponent,
    // DataService,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
