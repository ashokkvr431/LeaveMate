import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(form: NgForm) {
    if (form.invalid) return;

    this.authService.login(form.value).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          this.profileService.refreshProfile();

          alert(res.message || 'Login successful');
          form.resetForm();

          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else if (this.authService.isUser()) {
            this.router.navigate(['/user/dashboard']);
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          alert(res.message || 'Login failed');
        }
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Invalid credentials');
        } else if (err.status === 404) {
          alert('User not found');
        } else {
          alert('Server error');
        }
      }
    });
  }
}
