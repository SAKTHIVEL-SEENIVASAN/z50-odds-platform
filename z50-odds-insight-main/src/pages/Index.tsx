import { useEffect, useState } from "react";

const Index = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend-service-j9pn.onrender.com/matches")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-600">
        ⚡ Live AI Odds
      </h1>

      {loading && <p>Loading matches...</p>}

      {!loading && matches.length === 0 && (
        <p>No matches found</p>
      )}

      {matches.map((m: any) => (
        <div
          key={m.id}
          className="p-6 rounded-xl shadow-card border bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">
            {m.teamA} vs {m.teamB}
          </h2>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="font-bold">{m.teamA}</p>
              <p className="text-green-600 text-lg">
                {m.odds.teamA}
              </p>
              <p className="text-sm text-gray-500">
                {(m.probabilities.teamA * 100).toFixed(1)}%
              </p>
            </div>

            <div className="text-center">
              <p className="font-bold">Draw</p>
              <p className="text-yellow-600 text-lg">
                {m.odds.draw}
              </p>
              <p className="text-sm text-gray-500">
                {(m.probabilities.draw * 100).toFixed(1)}%
              </p>
            </div>

            <div className="text-center">
              <p className="font-bold">{m.teamB}</p>
              <p className="text-green-600 text-lg">
                {m.odds.teamB}
              </p>
              <p className="text-sm text-gray-500">
                {(m.probabilities.teamB * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;