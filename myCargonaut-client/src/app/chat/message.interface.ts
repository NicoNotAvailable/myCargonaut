export interface Message {
  id: number;
  writer: number;
  trip: number;
  message: string;
  read: boolean;
  timestamp: string;
}
