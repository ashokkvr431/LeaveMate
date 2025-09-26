import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  u: any = {};
  preview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  deletePhotoFlag: boolean = false; // track delete action

  constructor(private profile: ProfileService, private router: Router) {}

  ngOnInit() {
    this.profile.getProfile().subscribe({
      next: (res) => (this.u = res),
      error: (err) => console.error('Failed to load profile:', err),
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.deletePhotoFlag = false; // reset delete flag

      const reader = new FileReader();
      reader.onload = () => (this.preview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.preview = null;
    this.selectedFile = null;
    this.u.photo = null;
    this.deletePhotoFlag = true;
  }



  save() {
    const formData = new FormData();

    Object.keys(this.u).forEach((key) => {
      if (key !== 'photo' && this.u[key] !== null && this.u[key] !== undefined) {
        formData.append(key, this.u[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    if (this.deletePhotoFlag) {
      formData.append('deletePhoto', 'true'); // backend can handle this
    }

    this.profile.updateProfile(formData).subscribe({
      next: (updatedUser) => {
        alert('Profile Updated');
        this.profile.refreshProfile();
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Profile update failed');
      },
    });
  }
}
