import { useState, useMemo, useEffect } from 'react';
import { MATCHES } from '@/lib/matches-data';
import { processAllMatches, getMostPredictable, getClosestMatch } from '@/lib/odds-engine';
import MatchCard from '@/components/MatchCard';
import TopPicks from '@/components/TopPicks';
import { Search, Filter } from 'lucide-react';

const MatchesPage = () => {
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState('All');
  const [leagueFilter, setLeagueFilter] = useState('All');
  const [search, setSearch] = useState('');

  const matchesWithOdds = useMemo(() => processAllMatches(MATCHES), []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const sports = useMemo(
    () => ['All', ...Array.from(new Set(MATCHES.map((m) => m.sport)))],
    []
  );
  const leagues = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          MATCHES.filter((m) => sportFilter === 'All' || m.sport === sportFilter).map(
            (m) => m.league
          )
        )
      ),
    ],
    [sportFilter]
  );

  const filtered = useMemo(() => {
    return matchesWithOdds.filter((m) => {
      if (sportFilter !== 'All' && m.sport !== sportFilter) return false;
      if (leagueFilter !== 'All' && m.league !== leagueFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          m.team_a.toLowerCase().includes(s) ||
          m.team_b.toLowerCase().includes(s) ||
          m.league.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [matchesWithOdds, sportFilter, leagueFilter, search]);

  const mostPredictable = getMostPredictable(filtered);
  const closestMatch = getClosestMatch(filtered);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Generating AI odds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Live Matches</h2>
        <p className="text-sm text-muted-foreground">
          AI-powered odds generated from team statistics
        </p>
      </div>

      <TopPicks mostPredictable={mostPredictable} closestMatch={closestMatch} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams or leagues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={sportFilter}
            onChange={(e) => {
              setSportFilter(e.target.value);
              setLeagueFilter('All');
            }}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {sports.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={leagueFilter}
            onChange={(e) => setLeagueFilter(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {leagues.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((match) => (
          <MatchCard key={match.match_id} match={match} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No matches found.</p>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
