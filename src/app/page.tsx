"use client";

import { useState } from "react";
import { Summoner } from "@/types/summoner";

export default function Home() {
  const [summoner, setSummoner] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [champions, setChampions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchSummonerData(gameName: string, tagLine: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`);
      const data = await response.json();

      if (!response.ok) {
        setChampions([]);
        setError(data.error || "Failed to fetch summoner data");
        return;
      }

      setChampions(data.champions || []);

    } catch {
      setChampions([]);
      setError("Failed to fetch summoner data. Please check the name and tag line and try again.");

    } finally {
      setLoading(false);
    }

  }

  const mockSummner: Summoner = {
    gameName: "PlayerName",
    tagLine: "1234",
    rank: "Gold IV",
    champions: [
      { name: "Ahri", gamesPlayed: 20, winRate: 55, kda: 3.2 },
      { name: "Yasuo", gamesPlayed: 15, winRate: 40, kda: 2.8 },
      { name: "Lux", gamesPlayed: 10, winRate: 60, kda: 4.1 },
    ]
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = summoner.trim();
    const [gameName, tagLine] = trimmed.split("#");

    if (!gameName || !tagLine) {
      setError("Please enter a valid summoner name in the format 'Name#TagLine'");
      setChampions([]);
      return;
    }

    fetchSummonerData(gameName, tagLine);

    setSubmittedName(trimmed);
  }

  return (
    <main>
      <h1>League Analytics</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={summoner}
          onChange={(event) => setSummoner(event.target.value)}
          placeholder="Enter summoner as gameName#tagLine"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {submittedName && <p>Searching for: {submittedName}</p>}

      {submittedName && (
        <section>
          <h2>Summoner preview</h2>
          <p><strong>Name:</strong> {submittedName}</p>

          <h3>Top Champions</h3>
          <ul>
            {champions.map((champion: any) => (
              <li key={champion.championId}>
                Champion ID: {champion.championId} - Level: {champion.championLevel} - Points: {champion.championPoints}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

