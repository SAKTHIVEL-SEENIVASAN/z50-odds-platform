const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const AI_URL = "https://z50-odds-platform.onrender.com/generate-odds";

/* ===============================
   SAMPLE MATCH DATA
================================= */
const matches = [
  { id: 1, teamA: "Barcelona", teamB: "Real Madrid", teamA_rating: 88, teamB_rating: 86 },
  { id: 2, teamA: "Manchester City", teamB: "Arsenal", teamA_rating: 90, teamB_rating: 87 },
  { id: 3, teamA: "Bayern Munich", teamB: "Dortmund", teamA_rating: 91, teamB_rating: 84 }
];

/* ===============================
   ROOT
================================= */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ===============================
   GET MATCHES
================================= */
app.get("/matches", async (req, res) => {
  try {
    const result = await Promise.all(
      matches.map(async (m) => {
        const response = await axios.post(AI_URL, m);

        return {
          ...m,
          odds: response.data.odds,
          probabilities: {
            teamA: response.data.teamA_win_prob,
            teamB: response.data.teamB_win_prob,
            draw: response.data.draw_prob,
          },
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

/* ===============================
   AGENT
================================= */
app.post("/agent/query", async (req, res) => {
  try {
    const { question } = req.body;
    const match = matches[0];

    const response = await axios.post(AI_URL, match);
    const data = response.data;

    let answer = "";

    if (!question) {
      answer = "Please ask a question.";
    } else if (question.toLowerCase().includes("who")) {
      answer =
        data.teamA_win_prob > data.teamB_win_prob
          ? `${match.teamA} is more likely to win (${(data.teamA_win_prob * 100).toFixed(1)}%)`
          : `${match.teamB} is more likely to win (${(data.teamB_win_prob * 100).toFixed(1)}%)`;
    } else if (question.toLowerCase().includes("close")) {
      answer = "This match is quite close based on probabilities.";
    } else {
      answer = "Try asking: Who will win?";
    }

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: "Agent failed" });
  }
});

/* ===============================
   TEST
================================= */
app.get("/agent/test", async (req, res) => {
  try {
    const match = matches[0];
    const response = await axios.post(AI_URL, match);
    const data = response.data;

    const answer =
      data.teamA_win_prob > data.teamB_win_prob
        ? `${match.teamA} will likely win`
        : `${match.teamB} will likely win`;

    res.send(answer);
  } catch {
    res.send("Error in agent");
  }
});

/* ===============================
   START
================================= */
app.listen(5000, () => {
  console.log("Backend running 🚀");
});