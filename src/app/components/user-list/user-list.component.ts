import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  
  userList:any = []
  displayDrop = false;
  username = String;
  itemnum = 3;
  page = 1;
  sort = 'username';

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.getProfile().subscribe((data:any) => {
      this.username = data.user.username;
    })

    this.itemnum = 3;
    this.page = 1;
    this.sort = 'username';

    this.getUsers();  
  }

  getUsers() {
    this.apiService.getAllUsers(this.itemnum, this.page, this.sort).subscribe((data:any) => {
      this.userList = data;
    })
  }

  displayUser(user) {
    let modal = document.getElementById('custom-modal');
    let modalHeader = document.getElementById('modal-header');
    let modalContent = document.getElementById('modal-content');
    let background = document.getElementById('main-container');
    
    modalHeader.innerHTML = `Username: ${user.username}`;
    modalContent.innerHTML = `Gender: ${user.gender}<br>Birthdate: ${user.birthdate} <br>Email: ${user.email}`;
    modal.style.padding = '2rem';
    modal.style.borderRadius = '0.4rem'
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.textAlign = 'center';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.backgroundColor = '#ccd0d0';
    modal.style.zIndex = '1000';
    modal.style.position = 'absolute';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, 0)';
    modal.style.top = '30%';
    background.style.opacity = '0.3';
  }

  onUserClose() {
    let modal = document.getElementById('custom-modal');
    let background = document.getElementById('main-container');
    modal.style.display = 'none';
    background.style.opacity = '1';
  }

  deleteUser(user, index) {
    if(window.confirm('Are you sure?')) {
      let logData = {
        optype : 'delete-user',
        username : this.username,
        date : Date.now()
      }

      this.apiService.deleteUser(user.username).subscribe((data) => {
        this.userList.splice(index, 1);
        this.apiService.addLog(logData).subscribe((data) => {;})
      })    
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

  sortUserType() {
    this.sort = 'username';
    this.getUsers();
  }

  sortUserName() {
    this.sort = 'usertype';
    this.getUsers();
  }

  prevPage() {
    if(this.page > 1){
      this.page = this.page - 1;
    }
    this.getUsers();
  }

  nextPage() {
    this.page = this.page + 1;
    this.getUsers();
  }
}
