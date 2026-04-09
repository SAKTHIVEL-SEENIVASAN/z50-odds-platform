import { useMemo } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { MATCHES } from '@/lib/matches-data';
import { processAllMatches } from '@/lib/odds-engine';
import MatchCard from '@/components/MatchCard';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const allMatches = useMemo(() => processAllMatches(MATCHES), []);
  const favMatches = allMatches.filter((m) => favorites.includes(m.match_id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Favorites</h2>
        <p className="text-sm text-muted-foreground">
          Your saved matches ({favMatches.length})
        </p>
      </div>

      {favMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Heart className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">No favorites yet.</p>
          <p className="text-xs text-muted-foreground">Tap the heart icon on any match to save it.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favMatches.map((m) => (
            <MatchCard key={m.match_id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
