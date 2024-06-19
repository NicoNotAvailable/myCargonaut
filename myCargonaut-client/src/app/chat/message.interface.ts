
export interface Message {
  id: number;
  writer: {
    id: number;
  };
  trip: number;
  message: string;
  read: boolean;
  timestamp: string;
}
