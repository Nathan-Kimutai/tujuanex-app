//learning angular by consuming the tujuanex api
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../core/service/http/http.service';
import { AuthService } from '../../core/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  notificationType: string =  'is-danger';

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup( {
      username: new FormControl('',[Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.errorMessage = null;
    if(this.loginForm.valid) {
      this.httpService
        .post('auth/login',this.loginForm.value)
        .subscribe(
          (res:any) => {
            this.authService.setToken(res.token);
            this.authService.setUsername(res.username);
            if (this.authService.checkToken()) {
              this.router.navigateByUrl('/');
            } else {
              this.router.navigateByUrl('/login');
            }
          },
          (err) => {
            this.errorMessage = err.error.message;
            
          }
        )
    }
  }

  checkForEmailVerification() {
    this.errorMessage == null;
    let urlParams = null;
    this.route.queryParams.subscribe((params)=> {
      urlParams = params;
    });

    if(urlParams && urlParams['query']) {
      const query = { query: urlParams['query']};
      this.httpService.post('auth/verify',query).subscribe(
        (res: any) => {
          this.notificationType = 'is-success';
          this.errorMessage = 'res.message'
          console.log(res);
        },
        (err) => {
          this.errorMessage = err.error.message;
          console.log(err);
        }
      )
    }
  }

}
