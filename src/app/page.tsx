"use client";

import { useState } from "react";

import { Summoner } from "@/types/summoner";

export default function Home() {
  const [summoner, setSummoner] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const mockSummner: Summoner = {
    name: "PlayerName",
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
    if (!trimmed) return;
    setSubmittedName(trimmed);
  }

  return (
    <main>
      <h1>League Analytics</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={summoner}
          onChange={(event) => setSummoner(event.target.value)}
          placeholder="Enter summoner name"
        />
        <button type="submit">Search</button>
      </form>

      {submittedName && <p>Searching for: {submittedName}</p>}

      {submittedName && (
      <section>
        <h2>Summoner preview</h2>
        <p><strong>Name:</strong> {mockSummner.name}</p>
        <p><strong>Rank:</strong> {mockSummner.rank}</p>

        <h3>Top Champions</h3>
        <ul>
          {mockSummner.champions.map((champion) => (
            <li key={champion.name}>
              <strong>{champion.name}</strong> - Games: {champion.gamesPlayed}, Win Rate: {champion.winRate}%, KDA: {champion.kda}
            </li>
          ))}
        </ul>
      </section>
      )}
    </main>
  );
}

