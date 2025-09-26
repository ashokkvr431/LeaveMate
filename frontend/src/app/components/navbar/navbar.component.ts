import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  dropdownOpen = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.profileService.profile$.subscribe((profile) => this.user = profile);

    if (this.auth.isLoggedIn() && !this.user) {
      this.profileService.refreshProfile();
    }

    // Also check when user logs in later
    const savedUser = this.auth.getUser();
    if (savedUser) {
      this.profileService.refreshProfile();
    }

  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
