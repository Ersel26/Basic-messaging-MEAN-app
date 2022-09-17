import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlashMessagesService } from 'flash-messages-angular';

@Component({
  selector: 'app-regular-page',
  templateUrl: './regular-page.component.html',
  styleUrls: ['./regular-page.component.css']
})
export class RegularPageComponent implements OnInit {
  displayProfile = false;
  displaySend = false;
  displayMessage = false;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit(): void {
  }

  onLogoutClick() {
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
