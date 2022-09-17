import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-messsage-box',
  templateUrl: './messsage-box.component.html',
  styleUrls: ['./messsage-box.component.css']
})
export class MesssageBoxComponent implements OnInit {

  MessageBox:any = []
  BoxType: String
  displayDrop = false;
  itemnum = 3;
  page = 1;
  sort = 'date'

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.itemnum = 3;
    this.page = 1;
    this.sort = 'date';

    this.apiService.getInbox(this.itemnum, this.page, this.sort).subscribe((data) => {
      this.MessageBox = data;
    })
    this.BoxType = "INBOX";
  }

  displayInbox() {
    this.apiService.getInbox(this.itemnum, this.page, this.sort).subscribe((data) => {
      this.MessageBox = data;
    })
    this.BoxType = "INBOX";
  }

  displayOutbox() {
    this.apiService.getOutbox(this.itemnum, this.page, this.sort).subscribe((data) => {
      this.MessageBox = data;
    })
    this.BoxType = "OUTBOX";
  }

  refreshBox() {
    if(this.BoxType === "INBOX") {
      this.displayInbox();
    } else if(this.BoxType === "OUTBOX") {
      this.displayOutbox();
    }
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
    modal.style.left = '45%';
    modal.style.top = '30%';
  }

  onCloseRead() {
    let modal = document.getElementById('custom-modal');
    modal.style.display = 'none';
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
    this.refreshBox();
    this.MessageBox.reverse();
  }

  sortUserName() {
    if(this.BoxType === "INBOX") {
      this.sort = 'sender';
      this.refreshBox();
    } else if(this.BoxType === "OUTBOX") {
      this.sort = 'receiver';
      this.refreshBox();
    }
    
  }

  prevPage() {
    if(this.page > 1){
      this.page = this.page - 1;
    }
    this.refreshBox();
  }

  nextPage() {
    this.page = this.page + 1;
    this.refreshBox();
  }

}
