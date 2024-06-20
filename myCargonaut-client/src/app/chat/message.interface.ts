
export interface Message {
  id: number;
  writer: {
    id: number;
  };
  trip: {
    id: number;
  };
  message: string;
  read: boolean;
  timestamp: string;
}
