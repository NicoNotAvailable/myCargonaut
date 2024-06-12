import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly url: string = 'http://localhost:8000';

  constructor() {
    this.socket = io(this.url);
  }

  on(eventName: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
      return () => this.socket.off(eventName);
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
