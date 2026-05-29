"use client";

import { useState, useEffect } from "react";
import { Summoner } from "@/types/summoner";

export default function Home() {

  const [summoner, setSummoner] = useState("");
  const [submittedGameName, setSubmittedGameName] = useState("");
  const [champions, setChampions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Champion metadata lookup tables
  const [championNames, setChampionNames] =
    useState<Record<number, string>>({});

  const [championImageIds, setChampionImageIds] =
    useState<Record<number, string>>({});

  const [ddragonVersion, setDdragonVersion] = useState("");

  // Search history
  const [historySummoner, setHistorySummoner] =
    useState<string[]>([]);

  // =========================
  // Effects
  // =========================
  // Runs after component renders

  useEffect(() => {

    // Loads Riot champion metadata once on startup
    async function loadChampionNames() {

      const versionsResponse = await fetch(
        "https://ddragon.leagueoflegends.com/api/versions.json"
      );

      const versions = await versionsResponse.json();

      const latest = versions[0];

      setDdragonVersion(latest);

      const championsResponse = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`
      );

      const championsData = await championsResponse.json();

      const nameMap: Record<number, string> = {};
      const imageMap: Record<number, string> = {};

      // Convert Riot data into quick lookup maps
      for (const champ of Object.values(championsData.data) as {
        key: string;
        id: string;
        name: string;
      }[]) {

        nameMap[Number(champ.key)] = champ.name;

        imageMap[Number(champ.key)] = champ.id;
      }

      // Save metadata into React state
      setChampionNames(nameMap);

      setChampionImageIds(imageMap);
    }

    loadChampionNames();

  }, []);

  // =========================
  // Helper Functions
  // =========================
  // Small reusable utility functions

  function getChampionIconUrl(championId: number) {

    const imageId = championImageIds[championId];

    if (!imageId || !ddragonVersion) return null;

    return `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${imageId}.png`;
  }

  // =========================
  // API Functions
  // =========================
  // Handles backend/API requests

  async function fetchSummonerData(
    gameName: string,
    tagLine: string
  ) {

    setLoading(true);

    setError("");

    try {

      const response = await fetch(
        `/api/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
      );

      const data = await response.json();

      if (!response.ok) {

        setChampions([]);

        setError(
          data.error || "Failed to fetch summoner data"
        );

        return;
      }

      setChampions(data.champions || []);

    } catch {

      setChampions([]);

      setError(
        "Failed to fetch summoner data. Please check the name and tag line and try again."
      );

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // Event Handlers
  // =========================
  // Functions triggered by user actions

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    const trimmed = summoner.trim();

    const [gameName, tagLine] = trimmed.split("#");

    // Validate input format
    if (!gameName || !tagLine) {

      setError(
        "Please enter a valid summoner name in the format 'Name#TagLine'"
      );

      setChampions([]);

      return;
    }

    // Fetch Riot data
    fetchSummonerData(gameName, tagLine);

    // Update UI state
    setSubmittedGameName(trimmed);

    // Add newest search to top of history
    setHistorySummoner((prev) => [
      trimmed,
      ...prev.filter((name) => name !== trimmed),
    ]);
  }

  // =========================
  // Render UI
  // =========================
  // JSX returned to the page

  return (
    <main>

      <h1>League Analytics</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit}>

        <input
          value={summoner}

          onChange={(event) =>
            setSummoner(event.target.value)
          }

          placeholder="Enter summoner as gameName#tagLine"
        />

        <button type="submit">
          Search
        </button>

      </form>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error State */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Submitted Search */}
      {submittedGameName && (
        <p>
          Searching for: {submittedGameName}
        </p>
      )}

      {/* Search History */}
      <section>
        <h3>Search History</h3>
        <ul>
          {historySummoner.map((name) => (
            <li key={name}>
              {name}
            </li>
          ))}
        </ul>
      </section>
    
      {/* Champion Results */}
      {submittedGameName && (
        <section>
          <h2>Summoner Preview</h2>
          <p>
            <strong>Name:</strong>
            {" "}
            {submittedGameName}
          </p>

          <h3>Top Champions</h3>

          <ul>

            {champions.map((champion: any) => {
              // Convert champion ID into readable name
              const name =
                championNames[champion.championId]
                ?? `Unknown (${champion.championId})`;
              // Build champion icon URL
              const iconUrl =
                getChampionIconUrl(
                  champion.championId
                );
              return (
                <li
                  key={champion.championId}

                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {/* Champion Icon */}
                  {iconUrl && (
                    <img
                      src={iconUrl}
                      alt={name}
                      width={48}
                      height={48}
                    />
                  )}
                  {/* Champion Info */}
                  <span>
                    {name}
                    {" "}
                    - Points:
                    {" "}
                    {champion.championPoints}
                  </span>
                </li>
              );
            })}

          </ul>

        </section>
      )}

    </main>
  );
}