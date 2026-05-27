"use client";

import { useState } from "react";

export default function Home() {
  const [summoner, setSummoner] = useState("");
  const [submittedName, setSubmittedName] = useState("");

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
        <p><strong>Name:</strong> {submittedName}</p>
        <p><strong>Rank:</strong> Gold IV</p>
      </section>
      )}
    </main>
  );
}

