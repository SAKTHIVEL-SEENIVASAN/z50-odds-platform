import { Match, OddsResult, MatchWithOdds } from './types';

const WEIGHTS = {
  rating: 0.4,
  winRate: 0.3,
  scoring: 0.2,
  goalDiff: 0.1,
};

function addRandomness(value: number, range: number = 0.02): number {
  return value + (Math.random() * 2 - 1) * range;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function generateOdds(match: Match): OddsResult {
  const a = match.team_a_stats;
  const b = match.team_b_stats;

  // Normalize each factor to 0-1 scale relative to matchup
  const ratingTotal = a.rating + b.rating;
  const ratingA = a.rating / ratingTotal;
  const ratingB = b.rating / ratingTotal;

  const winsTotal = a.wins + b.wins || 1;
  const winRateA = a.wins / winsTotal;
  const winRateB = b.wins / winsTotal;

  const goalsTotal = a.goals_scored + b.goals_scored || 1;
  const scoringA = a.goals_scored / goalsTotal;
  const scoringB = b.goals_scored / goalsTotal;

  const gdMax = Math.max(Math.abs(a.goal_diff), Math.abs(b.goal_diff), 1);
  const gdA = (a.goal_diff + gdMax) / (2 * gdMax);
  const gdB = (b.goal_diff + gdMax) / (2 * gdMax);

  // Weighted composite score
  let scoreA =
    WEIGHTS.rating * ratingA +
    WEIGHTS.winRate * winRateA +
    WEIGHTS.scoring * scoringA +
    WEIGHTS.goalDiff * gdA;

  let scoreB =
    WEIGHTS.rating * ratingB +
    WEIGHTS.winRate * winRateB +
    WEIGHTS.scoring * scoringB +
    WEIGHTS.goalDiff * gdB;

  // Add randomness
  scoreA = addRandomness(scoreA);
  scoreB = addRandomness(scoreB);

  const total = scoreA + scoreB;
  let rawA = scoreA / total;
  let rawB = scoreB / total;

  // Draw probability based on closeness
  const closeness = 1 - Math.abs(rawA - rawB);
  let drawProb = clamp(closeness * 0.25 + addRandomness(0, 0.02), 0.05, 0.35);

  // For non-draw sports, minimize draw
  if (match.sport === 'Tennis' || match.sport === 'Basketball') {
    drawProb = clamp(drawProb * 0.15, 0.01, 0.05);
  }

  let teamA_win = rawA * (1 - drawProb);
  let teamB_win = rawB * (1 - drawProb);

  // Normalize
  const probTotal = teamA_win + teamB_win + drawProb;
  teamA_win = clamp(teamA_win / probTotal, 0.01, 0.98);
  teamB_win = clamp(teamB_win / probTotal, 0.01, 0.98);
  drawProb = clamp(1 - teamA_win - teamB_win, 0.01, 0.98);

  const favorite = teamA_win > teamB_win ? 'A' : teamB_win > teamA_win ? 'B' : 'draw';

  const oddsA = parseFloat((1 / teamA_win).toFixed(2));
  const oddsB = parseFloat((1 / teamB_win).toFixed(2));
  const oddsDraw = parseFloat((1 / drawProb).toFixed(2));

  const explanation = buildExplanation(match, teamA_win, teamB_win, drawProb, favorite);

  return {
    teamA_win_prob: parseFloat((teamA_win * 100).toFixed(1)),
    teamB_win_prob: parseFloat((teamB_win * 100).toFixed(1)),
    draw_prob: parseFloat((drawProb * 100).toFixed(1)),
    odds: { teamA: oddsA, teamB: oddsB, draw: oddsDraw },
    explanation,
    favorite,
  };
}

function buildExplanation(
  match: Match,
  probA: number,
  probB: number,
  drawProb: number,
  fav: 'A' | 'B' | 'draw'
): string {
  const favTeam = fav === 'A' ? match.team_a : fav === 'B' ? match.team_b : 'Neither team';
  const favProb = fav === 'A' ? probA : fav === 'B' ? probB : drawProb;
  const a = match.team_a_stats;
  const b = match.team_b_stats;

  const reasons: string[] = [];
  if (fav !== 'draw') {
    const favStats = fav === 'A' ? a : b;
    const oppStats = fav === 'A' ? b : a;
    if (favStats.rating > oppStats.rating)
      reasons.push(`higher rating (${favStats.rating} vs ${oppStats.rating})`);
    if (favStats.wins > oppStats.wins)
      reasons.push(`more wins (${favStats.wins} vs ${oppStats.wins})`);
    if (favStats.goals_scored > oppStats.goals_scored)
      reasons.push(`better scoring (${favStats.goals_scored} vs ${oppStats.goals_scored})`);
    if (favStats.goal_diff > oppStats.goal_diff)
      reasons.push(`stronger goal difference (+${favStats.goal_diff} vs +${oppStats.goal_diff})`);
  }

  const reasonStr = reasons.length > 0 ? ` Key factors: ${reasons.join(', ')}.` : '';

  return `${favTeam} is favored at ${(favProb * 100).toFixed(1)}% win probability.${reasonStr} Draw probability: ${(drawProb * 100).toFixed(1)}%.`;
}

export function processAllMatches(matches: Match[]): MatchWithOdds[] {
  return matches.map((m) => ({
    ...m,
    odds: generateOdds(m),
  }));
}

export function getMostPredictable(matches: MatchWithOdds[]): MatchWithOdds | undefined {
  return [...matches].sort((a, b) => {
    const maxA = Math.max(a.odds.teamA_win_prob, a.odds.teamB_win_prob);
    const maxB = Math.max(b.odds.teamA_win_prob, b.odds.teamB_win_prob);
    return maxB - maxA;
  })[0];
}

export function getClosestMatch(matches: MatchWithOdds[]): MatchWithOdds | undefined {
  return [...matches].sort((a, b) => {
    const diffA = Math.abs(a.odds.teamA_win_prob - a.odds.teamB_win_prob);
    const diffB = Math.abs(b.odds.teamA_win_prob - b.odds.teamB_win_prob);
    return diffA - diffB;
  })[0];
}
