import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  messageList:any = []
  displayDrop = false
  username : String
  itemnum = 5;
  page = 1;
  sort = 'date'

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.itemnum = 5;
    this.page = 1;
    this.sort = 'date';

    this.getMessages();
    
    this.apiService.getProfile().subscribe((data:any) => {
      this.username = data.user.username;
    })
  }

  getMessages() {
    this.apiService.getAllMessages(this.itemnum, this.page, this.sort).subscribe((data:any) => {
      this.messageList = data;
    })
  }

  onRead(message, index) {
    let modal = document.getElementById('custom-modal');
    let modalContent = document.getElementById('modal-content');
    let background = document.getElementById('main-container');

    modalContent.innerHTML = message.content;
    modal.style.padding = '2rem';
    modal.style.borderRadius = '0.4rem'
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.textAlign = 'center'; 
    modal.style.backgroundColor = '#ccd0d0';
    modal.style.zIndex = '1000';
    modal.style.position = 'absolute';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, 0)';
    modal.style.top = '30%';
    background.style.opacity = '0.3';
  }

  onCloseRead() {
    let modal = document.getElementById('custom-modal');
    let background = document.getElementById('main-container');
    modal.style.display = 'none';
    background.style.opacity = '1';
  }

  deleteMessage(message, index) {
    if(window.confirm('Are you sure?')) {
      let logData = {
        optype : 'delete-message',
        username : this.username,
        date : Date.now()
      }

      this.apiService.deleteMessage(message).subscribe(data => {
        this.messageList.splice(index, 1);
        this.apiService.addLog(logData).subscribe((data) => {;})
      })

      this.getMessages();
    }
  }

  drop() {
    this.displayDrop = !this.displayDrop
    let options:any = document.getElementById('options')
    if(this.displayDrop) {
      options.style.display = 'block';
    } else {
      options.style.display = 'none';
    }
  }

  sortDate() {
    this.sort = 'date';
    this.getMessages();
    this.messageList.reverse();
  }

  sortSender() {
    this.sort = 'sender';
    this.getMessages();
  }

  sortReceiver() {
    this.sort = 'receiver';
    this.getMessages();
  }

  prevPage() {
    if(this.page > 1){
      this.page = this.page - 1;
    }
    this.getMessages();
  }

  nextPage() {
    this.page = this.page + 1;
    this.getMessages();
  }

}
