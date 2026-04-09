import { MatchWithOdds } from '@/lib/types';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
  match: MatchWithOdds;
}

const MatchCard = ({ match }: Props) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const fav = isFavorite(match.match_id);
  const { odds } = match;

  const favTeam = odds.favorite === 'A' ? 'team_a' : 'team_b';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            {match.sport}
          </span>
          <span className="text-xs text-muted-foreground">{match.league}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(match.start_time).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <button
            onClick={() => toggleFavorite(match.match_id)}
            className="rounded-full p-1 transition-colors hover:bg-accent"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                fav ? 'fill-primary text-primary' : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Teams & Odds */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 items-center gap-2">
          {/* Team A */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-sm font-semibold text-foreground">{match.team_a}</p>
              {favTeam === 'team_a' && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  FAV
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Rating: {match.team_a_stats.rating}</p>
            <p className="mt-1 text-xl font-bold text-primary">{odds.odds.teamA}</p>
            <p className="text-xs text-muted-foreground">{odds.teamA_win_prob}%</p>
          </div>

          {/* Draw */}
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground">Draw</p>
            <p className="text-lg font-bold text-foreground">{odds.odds.draw}</p>
            <p className="text-xs text-muted-foreground">{odds.draw_prob}%</p>
          </div>

          {/* Team B */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-sm font-semibold text-foreground">{match.team_b}</p>
              {favTeam === 'team_b' && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  FAV
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Rating: {match.team_b_stats.rating}</p>
            <p className="mt-1 text-xl font-bold text-primary">{odds.odds.teamB}</p>
            <p className="text-xs text-muted-foreground">{odds.teamB_win_prob}%</p>
          </div>
        </div>

        {/* Probability bars */}
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="rounded-l-full bg-primary transition-all duration-500"
            style={{ width: `${odds.teamA_win_prob}%` }}
          />
          <div
            className="bg-foreground/20 transition-all duration-500"
            style={{ width: `${odds.draw_prob}%` }}
          />
          <div
            className="rounded-r-full bg-info transition-all duration-500"
            style={{ width: `${odds.teamB_win_prob}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{match.team_a}</span>
          <span>Draw</span>
          <span>{match.team_b}</span>
        </div>
      </div>

      {/* AI Explanation Toggle */}
      <div className="border-t border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-4 py-2 text-xs text-muted-foreground hover:bg-accent/50 transition-colors"
        >
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            AI Analysis
          </span>
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {expanded && (
          <div className="animate-slide-up px-4 pb-3">
            <p className="text-xs leading-relaxed text-muted-foreground">{odds.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
