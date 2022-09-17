import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  userForm: FormGroup;
  userType: any = ['admin', 'regular'];
  gender: any = ['male', 'female'];

  user: any = null;

  username : String

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.mainForm();
  }

  ngOnInit(): void {
    this.apiService.getProfile().subscribe((data:any) => {
      this.username = data.user.username;
    })

    if(this.route.snapshot.paramMap.get('type') === 'update') {
      this.apiService.getSingleUser(this.route.snapshot.paramMap.get('username')).subscribe((data:any) => {
        this.user = data;
        this.userForm.patchValue({
          usertype : this.user.usertype,
          username : this.user.username,
          password : this.user.password,
          name : this.user.name,
          surname : this.user.surname,
          birthdate : this.user.birthdate,
          gender : this.user.gender,
          email : this.user.email,
          })
      })
    }
  }

  mainForm() {
    this.userForm = this.fb.group({
      usertype: ['',[Validators.required]],
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
      name: ['',[Validators.required]],
      surname: ['',[Validators.required]],
      birthdate: ['',[Validators.required]],
      gender: ['',[Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
    });
  }

  //Choose usertype and gender 
  updateProfile(e) {
    this.userForm.get('userType').setValue(e, {
      onlySelf: true,
    });
    this.userForm.get('gender').setValue(e, {
      onlySelf: true,
    });
  }

  // Getter to access form control
  get myForm() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if(!this.user) {
      if (!this.userForm.valid) {
        return false;
      } else {
        let logData = {
          optype : 'create-user',
          username : this.username,
          date : Date.now()
        }

        return this.apiService.registerUser(this.userForm.value).subscribe({
          complete: () => {
            console.log('User successfully created!'),
              this.apiService.addLog(logData).subscribe((data) => {;})
              this.ngZone.run(() => this.router.navigateByUrl('/userlist'));
          },
          error: (e) => {
            console.log(e);
          },
        });
      }
    } else {
      let logData = {
        optype : 'update-user',
        username : this.username,
        date : Date.now()
      }

      return this.apiService.updateUser(this.userForm.value).subscribe({
        complete: () => {
          console.log('User successfully updated!'),
            this.apiService.addLog(logData).subscribe((data) => {;})
            this.ngZone.run(() => this.router.navigateByUrl('/userlist'));
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }
}
