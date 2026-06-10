export type Category = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
};

export type Channel = {
  id: string;
  name: string;
  categoryId: string;
  logo: string;
  streamUrl: string; // The HLS .m3u8 URL
};

export type MatchStatus = 'LIVE' | 'UPCOMING' | 'FINISHED';

export type Team = {
  id: string;
  name: string;
  logo: string;
  score?: number;
};

export type Match = {
  id: string;
  league: string;
  leagueLogo?: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string; // ISO date string
  status: MatchStatus;
  channelId?: string; // Channel broadcasting the match
  commentator?: string;
};
