import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlashMessagesService } from 'flash-messages-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private flashMessages: FlashMessagesService
    ) { 
      this.mainForm();
    }

  ngOnInit(): void {
  }

  mainForm() {
    this.loginForm = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
    })
  }

  get myForm() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return false;
    } else {
      return this.apiService.authenticateUser(this.loginForm.value).subscribe((data:any) => {
        if(data.success) {
          this.apiService.saveUserInfo(data.token, data.user);

          let logData = {
            optype : 'login',
            username : data.user.username,
            date : Date.now()
          }

          this.apiService.addLog(logData).subscribe((data) => {;})

          if(data.user.usertype === 'admin') {
            this.ngZone.run(() => this.router.navigateByUrl('/admin'));
          } else if (data.user.usertype === 'regular'){
            this.ngZone.run(() => this.router.navigateByUrl('/regular'));
          }
        }
        else {
          console.log(data.msg);
          this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
        }
      })
    }
  }

}
