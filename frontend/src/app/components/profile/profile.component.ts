import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.profile$.subscribe((profile) => (this.user = profile));

    // Load profile if not already cached
    if (!this.user) {
      this.profileService.refreshProfile();
    }
  }
}



// import { Component, OnInit } from '@angular/core';
// import { ProfileService } from '../../services/profile.service';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html'
// })
// export class ProfileComponent implements OnInit {
//   u:any=null;
//   constructor(private profile: ProfileService){}
//   ngOnInit(){ this.profile.getProfile().subscribe(r=> this.u=r); }
// }
