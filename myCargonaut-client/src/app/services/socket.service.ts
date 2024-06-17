import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  private readonly url: string = 'http://localhost:8000';
  private socketInitialized: boolean = false;

  constructor() {}

  public init(): void {
    console.log('Socket initialization started...');
    if (!this.socketInitialized) {
      this.socket = io(this.url, {
        autoConnect: true
      });
      this.socketInitialized = true;
      console.log('Socket initialized:', this.socketInitialized);
    }
  }

  private getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket is not initialized.');
    }
    return this.socket;
  }

  on(eventName: string): Observable<any> {
    return new Observable<any>(observer => {
      const socket = this.getSocket();
      socket.on(eventName, (data: any) => {
        observer.next(data);
      });
      return () => socket.off(eventName);
    });
  }

  emit(eventName: string, data: any): void {
    const socket = this.getSocket();
    socket.emit(eventName, data);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
