import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface Notification {
  message: string;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private maxNotifications = 1;

  constructor(private router: Router) { }

  showNotification(message: string, link?: string): void {
    if (this.notifications.length >= this.maxNotifications) {
      this.notifications.shift(); // Remove oldest notification if max limit reached
    }
    this.notifications.push({ message, link });

    setTimeout(() => {
      this.notifications.shift();
    }, 10000); // 10 seconds
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  clearNotifications(): void {
    this.notifications = [];
  }

  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }

  navigateTo(link: string): void {
    this.router.navigate([link]);
  }
}
