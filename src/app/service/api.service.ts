import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  baseUri: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  logUrl: string = 'http://localhost:4000/api/add-log';
  
  constructor(private http: HttpClient) { }
  

  authenticateUser(data) {
    let url = `${this.baseUri}/authenticate`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  saveUserInfo(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.clear();
  }

  getProfile() {
    let url = `${this.baseUri}/user`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  getAllUsers(itemnum, page, sorttype) {
    let url = `${this.baseUri}/user/${itemnum}/${page}/${sorttype}`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  getUsersForRec() {
    let url = `${this.baseUri}/`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  saveMessage(data) {
    let url = `${this.baseUri}/message`;
    return this.http.post(url, data, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  getInbox(itemnum, page, sorttype) {
    let url = `${this.baseUri}/get-inbox/${itemnum}/${page}/${sorttype}`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  getOutbox(itemnum, page, sorttype) {
    let url = `${this.baseUri}/get-outbox/${itemnum}/${page}/${sorttype}`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  getSingleUser(username) {
    let url = `${this.baseUri}/user/${username}`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  deleteUser(username) {
    let url = `${this.baseUri}/user/${username}`;
    return this.http.delete(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  getAllMessages(itemnum, page, sorttype) {
    let url = `${this.baseUri}/message/${itemnum}/${page}/${sorttype}`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  deleteMessage(message) {
    let url = `${this.baseUri}/message/${message._id}`;
    return this.http.delete(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  registerUser(data) {
    let url = `${this.baseUri}/user`;
    return this.http.post(url, data, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  updateUser(data) {
    let url = `${this.baseUri}/user/${data.username}`;
    return this.http.put(url, data, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  addLog(data) {
    let url = `${this.baseUri}/log`;
    return this.http.post(url, data, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  getAllLogs(itemnum, page, sorttype) {
    let url = `${this.baseUri}/log/${itemnum}/${page}/${sorttype}`;
    return this.http.get(url, {headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)}).pipe(catchError(this.errorMgmt));
  }

  isAdminLoggedIn() {
    if(this.isUserLoggedIn()) {
      let token = localStorage.getItem('token');
      let decoded : any = jwtDecode(token);
      return (decoded.user.usertype === 'admin');
    }
    return false
  }

  isUserLoggedIn() {
    return !!localStorage.getItem('token');
  }


  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
