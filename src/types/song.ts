export type dashboardSong = {
  id:string;
  logo: string;
  title: string;
  played: number;
  playslistCount: string;
  likes: number;
  duration: number;
  explicit: boolean;
  visibility: 'Public' | 'Private';
};