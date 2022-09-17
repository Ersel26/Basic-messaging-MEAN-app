import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlashMessagesService } from 'flash-messages-angular';


@Component({
  selector: 'app-save-message',
  templateUrl: './save-message.component.html',
  styleUrls: ['./save-message.component.css']
})
export class SaveMessageComponent implements OnInit {
  submitted = false;

  sender: String;
  receiver: String;
  content: String;
  date: Date;

  messageForm: FormGroup;

  recommendList: any = []

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
    this.apiService.getProfile().subscribe((profile:any) => {
      this.sender = profile.user.username;
    })
  }

  mainForm() {
    this.messageForm = this.fb.group({
      receiver: ['',[Validators.required]],
      content: ['',[Validators.required]]
    })
  }

  // Getter to access form control
  get myForm() {
    return this.messageForm.controls;
  }

  getRecommend() {
    let input = this.messageForm.value.receiver;

    if(input !== ''){
      this.apiService.getUsersForRec().subscribe((data:any) => {
        this.recommendList = data.filter(user => user.username.includes(input));
      })
      this.recommendList.sort((a,b) => a.username > b.username ? 1 : a.username < b.username ? -1 : 0)
    } else {
      this.recommendList = []
    }
  }

  autoFill(recommend) {
    this.messageForm.patchValue({
      receiver: recommend
    })
    this.recommendList = []
  }

  onMessageSend() {
    this.submitted = true;

    if (!this.messageForm.valid) {
      return false;
    } else {
      this.receiver = this.messageForm.value.receiver;
      this.content = this.messageForm.value.content;
      this.date = new Date();

      const message = {
        sender: this.sender,
        receiver: this.receiver,
        content: this.content,
        date: this.date
      }

      let logData = {
        optype : 'message-sent',
        username : this.sender,
        date : Date.now()
      }

      this.apiService.addLog(logData).subscribe((data) => {;})

      return this.apiService.saveMessage(message).subscribe({
        complete: () => {
          this.flashMessages.show("message sent succesfully", {cssClass: 'alert-success', timeout: 4000});
        },
        error: (e) => {
          console.log(e);
        },
      });
    }

    
  }
}
