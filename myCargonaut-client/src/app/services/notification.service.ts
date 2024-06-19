import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [];
  private maxNotifications = 2;

  constructor() { }

  showNotification(message: string): void {
    if (this.notifications.length >= this.maxNotifications) {
      this.notifications.shift(); // Remove oldest notification if max limit reached
    }
    this.notifications.push(message);
  }

  getNotifications(): string[] {
    return this.notifications;
  }

  clearNotifications(): void {
    this.notifications = [];
  }
}
