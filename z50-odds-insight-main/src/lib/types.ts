export interface TeamStats {
  rating: number;
  wins: number;
  goals_scored: number;
  goal_diff: number;
}

export interface Match {
  match_id: string;
  sport: string;
  league: string;
  team_a: string;
  team_b: string;
  start_time: string;
  team_a_stats: TeamStats;
  team_b_stats: TeamStats;
}

export interface OddsResult {
  teamA_win_prob: number;
  teamB_win_prob: number;
  draw_prob: number;
  odds: {
    teamA: number;
    teamB: number;
    draw: number;
  };
  explanation: string;
  favorite: 'A' | 'B' | 'draw';
}

export interface MatchWithOdds extends Match {
  odds: OddsResult;
}

export interface AgentResponse {
  query: string;
  answer: string;
  relevantMatches?: MatchWithOdds[];
}
