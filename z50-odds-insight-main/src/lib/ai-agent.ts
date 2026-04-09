import { MatchWithOdds, AgentResponse } from './types';
import { getMostPredictable, getClosestMatch } from './odds-engine';

export function queryAgent(query: string, matches: MatchWithOdds[]): AgentResponse {
  const q = query.toLowerCase();

  if (q.includes('predictable') || q.includes('safest') || q.includes('confident')) {
    const m = getMostPredictable(matches);
    if (!m) return { query, answer: 'No matches available.' };
    const fav = m.odds.favorite === 'A' ? m.team_a : m.team_b;
    const prob = Math.max(m.odds.teamA_win_prob, m.odds.teamB_win_prob);
    return {
      query,
      answer: `The most predictable match is ${m.team_a} vs ${m.team_b} (${m.league}). ${fav} is heavily favored with a ${prob}% win probability. ${m.odds.explanation}`,
      relevantMatches: [m],
    };
  }

  if (q.includes('close') || q.includes('tight') || q.includes('even') || q.includes('upset')) {
    const m = getClosestMatch(matches);
    if (!m) return { query, answer: 'No matches available.' };
    return {
      query,
      answer: `The closest match is ${m.team_a} vs ${m.team_b} (${m.league}). Probabilities are very tight — ${m.team_a}: ${m.odds.teamA_win_prob}%, ${m.team_b}: ${m.odds.teamB_win_prob}%, Draw: ${m.odds.draw_prob}%. This is a coin-flip match with high upset potential.`,
      relevantMatches: [m],
    };
  }

  // Check for team name
  const teamMatch = matches.find(
    (m) => q.includes(m.team_a.toLowerCase()) || q.includes(m.team_b.toLowerCase())
  );
  if (teamMatch) {
    const fav = teamMatch.odds.favorite === 'A' ? teamMatch.team_a : teamMatch.team_b;
    return {
      query,
      answer: `In ${teamMatch.team_a} vs ${teamMatch.team_b}: ${teamMatch.odds.explanation} My recommendation: ${fav} is the stronger pick based on current form and statistics.`,
      relevantMatches: [teamMatch],
    };
  }

  if (q.includes('win') || q.includes('who') || q.includes('best')) {
    const best = getMostPredictable(matches);
    if (!best) return { query, answer: 'No matches available.' };
    const fav = best.odds.favorite === 'A' ? best.team_a : best.team_b;
    return {
      query,
      answer: `Looking at all matches, ${fav} has the highest win probability at ${Math.max(best.odds.teamA_win_prob, best.odds.teamB_win_prob)}% in the ${best.team_a} vs ${best.team_b} matchup. ${best.odds.explanation}`,
      relevantMatches: [best],
    };
  }

  // Default: summary
  const top3 = [...matches]
    .sort((a, b) => {
      const maxA = Math.max(a.odds.teamA_win_prob, a.odds.teamB_win_prob);
      const maxB = Math.max(b.odds.teamA_win_prob, b.odds.teamB_win_prob);
      return maxB - maxA;
    })
    .slice(0, 3);

  const lines = top3.map((m) => {
    const fav = m.odds.favorite === 'A' ? m.team_a : m.team_b;
    const prob = Math.max(m.odds.teamA_win_prob, m.odds.teamB_win_prob);
    return `• ${m.team_a} vs ${m.team_b} — ${fav} favored (${prob}%)`;
  });

  return {
    query,
    answer: `Here's a quick summary of the top picks:\n\n${lines.join('\n')}\n\nTry asking about a specific team, close matches, or the most predictable outcome!`,
    relevantMatches: top3,
  };
}
