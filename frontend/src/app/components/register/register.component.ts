import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) {}

  signin(form: NgForm) {
    if (form.invalid || form.value.password !== form.value.cpassword) {
      alert("Passwords do not match!");
      return;
    }

    this.authService.register(form.value).subscribe({
      next: (res: any) => {
        alert(res.message || 'Registration successful');
        form.reset();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        if (err.status === 409) {
          alert('This email is already registered. Please login instead.');
        } else if (err.status === 403) {
          alert('Forbidden – only admins can register users');
        } else {
          alert('Server error');
        }
      }
    });
  }
}
