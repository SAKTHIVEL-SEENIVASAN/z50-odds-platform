import { MatchWithOdds } from '@/lib/types';
import { Trophy, Target } from 'lucide-react';

interface Props {
  mostPredictable?: MatchWithOdds;
  closestMatch?: MatchWithOdds;
}

const TopPicks = ({ mostPredictable, closestMatch }: Props) => {
  if (!mostPredictable && !closestMatch) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {mostPredictable && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 animate-slide-up">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Most Predictable</h3>
          </div>
          <p className="text-sm font-medium text-foreground">
            {mostPredictable.team_a} vs {mostPredictable.team_b}
          </p>
          <p className="text-xs text-muted-foreground">{mostPredictable.league}</p>
          <p className="mt-1 text-xs text-primary font-medium">
            {mostPredictable.odds.favorite === 'A'
              ? mostPredictable.team_a
              : mostPredictable.team_b}{' '}
            — {Math.max(mostPredictable.odds.teamA_win_prob, mostPredictable.odds.teamB_win_prob)}%
          </p>
        </div>
      )}
      {closestMatch && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 animate-slide-up">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-5 w-5 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Closest Match</h3>
          </div>
          <p className="text-sm font-medium text-foreground">
            {closestMatch.team_a} vs {closestMatch.team_b}
          </p>
          <p className="text-xs text-muted-foreground">{closestMatch.league}</p>
          <p className="mt-1 text-xs text-warning font-medium">
            {closestMatch.odds.teamA_win_prob}% vs {closestMatch.odds.teamB_win_prob}%
          </p>
        </div>
      )}
    </div>
  );
};

export default TopPicks;
