import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.on('message').subscribe((data: any) => {
      console.log('Message received:', data);
    });

    this.socketService.emit('join', { room: 'room1' });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
