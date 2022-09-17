import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from 'flash-messages-angular';

import { ApiService } from './service/api.service';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { RegularPageComponent } from './components/regular-page/regular-page.component';
import { SaveMessageComponent } from './components/save-message/save-message.component';
import { MesssageBoxComponent } from './components/messsage-box/messsage-box.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { LogListComponent } from './components/log-list/log-list.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    AdminPageComponent,
    RegularPageComponent,
    SaveMessageComponent,
    MesssageBoxComponent,
    UserListComponent,
    MessageListComponent,
    LogListComponent,
  ],
  imports: [
    FlashMessagesModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
