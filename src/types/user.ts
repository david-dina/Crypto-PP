export interface User {
  avatarUrl: string;
  id: string;
  name: string;
  username: string;
  phoneNumber?:string;
  email:string;
  aiToken: string;
  description?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  followers: number;
  following: number;
  songs: number;
}
