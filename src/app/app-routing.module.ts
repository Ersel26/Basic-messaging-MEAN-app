import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { RegularPageComponent } from './components/regular-page/regular-page.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { LogListComponent } from './components/log-list/log-list.component';
import { AuthUserGuard } from './auth-user.guard';
import { AuthAdminGuard } from './auth-admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'register/:type/:username', component: RegisterComponent, canActivate: [AuthAdminGuard] },
  { path: 'register/:type', component: RegisterComponent, canActivate: [AuthAdminGuard] },
  { path: 'login',  component: LoginComponent },
  { path: 'admin', component:  AdminPageComponent, canActivate: [AuthAdminGuard] },
  { path: 'regular', component: RegularPageComponent, canActivate: [AuthUserGuard] },
  { path: 'userlist', component: UserListComponent, canActivate: [AuthAdminGuard]},
  { path: 'messagelist', component: MessageListComponent, canActivate: [AuthAdminGuard] },
  { path: 'loglist', component: LogListComponent, canActivate: [AuthAdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
