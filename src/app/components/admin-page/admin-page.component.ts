import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlashMessagesService } from 'flash-messages-angular';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  displayProfile = false;
  displaySend = false;
  displayMessage = false;
  username: string
  

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.apiService.getProfile().subscribe((data:any) => {
      this.username = data.user.username;
    })
  }

  onLogoutClick() {
    let logData = {
      optype : 'logout',
      username : this.username,
      date : Date.now()
    }

    this.apiService.addLog(logData).subscribe((data) => {;})

    this.apiService.logout();
    this.flashMessages.show('Logged out successfully', {cssClass: "alert-success", timeout: 3000})
    this.ngZone.run(() => this.router.navigateByUrl('/login'));
  }

  toggleProfile() {
    this.displayProfile = !this.displayProfile;
    let profile:any = document.getElementsByTagName('app-profile')[0]

    if(this.displayProfile) {
      profile.style.display = 'inline-block';
    } else {
      profile.style.display = 'none';
    }
  }

  toggleSend() {
    this.displaySend = !this.displaySend;
    let send:any = document.getElementsByTagName('app-save-message')[0]

    if(this.displaySend) {
      send.style.display = 'inline-block';
    } else {
      send.style.display = "none";
    }
  }

  toggleMessageBox() {
    this.displayMessage = !this.displayMessage;
    let messageBox:any = document.getElementsByTagName('app-messsage-box')[0]

    if(this.displayMessage) {
      messageBox.style.display = 'block';
    } else {
      messageBox.style.display = 'none';
    }
  }

}
