export interface Message {
  id: string;
  message: string;
  sender: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
}
