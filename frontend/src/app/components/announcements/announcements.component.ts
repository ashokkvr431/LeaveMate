import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AnnouncementsService, Announcement } from 'src/app/services/announcements.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  newAnnouncement: Partial<Announcement> = { title: '', message: '' };

  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    public auth: AuthService,
    private announcementService: AnnouncementsService
  ) { }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.loading = true;
    this.error = null;
    this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load announcements. Please try again.';
        this.loading = false;
      }
    });
  }

  addAnnouncement() {
    if (!this.newAnnouncement.title || !this.newAnnouncement.message) return;

    this.announcementService.addAnnouncement(this.newAnnouncement as Announcement).subscribe({
      next: (ann) => {
        this.announcements.unshift(ann);
        this.newAnnouncement = { title: '', message: '' };
        this.success = 'Announcement added successfully!';
        setTimeout(() => (this.success = null), 3000);
      },
      error: () => {
        this.error = 'Failed to add announcement. Please try again.';
      }
    });
  }

  deleteAnnouncement(id: number) {
    this.announcementService.deleteAnnouncement(id).subscribe({
      next: () => {
        this.announcements = this.announcements.filter((ann) => ann.id !== id);
        this.success = 'Announcement deleted successfully!';
        setTimeout(() => (this.success = null), 3000);
      },
      error: () => {
        this.error = 'Failed to delete announcement. Please try again.';
      }
    });
  }
}
