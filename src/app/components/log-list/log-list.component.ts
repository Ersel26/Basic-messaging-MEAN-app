import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent implements OnInit {
  logList:any = []
  displayDrop = false
  itemnum = 10;
  page = 1;
  sort = 'date'

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.itemnum = 10;
    this.page = 1;
    this.sort = 'date';

    this.getLoglist();
  }

  getLoglist() {
    this.apiService.getAllLogs(this.itemnum, this.page, this.sort).subscribe((data:any) => {
      this.logList = data;
    })
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

  sortUser() {
    this.sort = 'username';
    this.getLoglist();
  }

  sortDate() {
    this.sort = 'date';
    this.getLoglist();
    this.logList.reverse();
  }

  sortOperation() {
    this.sort = 'optype';
    this.getLoglist();
  }

  prevPage() {
    if(this.page > 1){
      this.page = this.page - 1;
    }
    this.getLoglist();
  }

  nextPage() {
    this.page = this.page + 1;
    this.getLoglist();
  }

}
