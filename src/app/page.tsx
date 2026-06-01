"use client";

// Styles
import styles from "./page.module.css";

// React
import { useState } from "react";

// Components
import ChampionList from "@/components/ChampionList";
import SummonerCard from "@/components/SummonerCard";

// Types
import { Champion } from "@/types/champion";
import { Summoner } from "@/types/summoner";

import { getChampionIconUrl } from "@/lib/ddragon";
import { useChampionMetadata } from "@/hooks/useChampionMetadata";

export default function Home() {

  // Search State
  const [summonerInput, setSummonerInput] = useState("");
  const [summoner, setSummoner] = useState<Summoner | null>(null);

  // Champion Data
  const [champions, setChampions] = useState<Champion[]>([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Riot Metadata
  const { ddragonVersion, championNames, championImageIds, loading: metadataLoading } = useChampionMetadata();

  // =========================
  // API Functions
  // =========================
  // Handles backend/API requests

  // Fetch champion mastery data for a summoner
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
        setSummoner(null);
        setChampions([]);
        setError(
          data.error || "Failed to fetch summoner data"
        );
        return;
      }
      setSummoner(data.summoner || null);
      setChampions(data.champions || []);
    } catch {
      setSummoner(null);
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

    const trimmed = summonerInput.trim();
    const [gameName, tagLine] = trimmed.split("#");

    // Validate input format
    if (!gameName || !tagLine) {
      setError(
        "Please enter a valid summoner name in the format 'Name#TagLine'"
      );
      setSummoner(null);
      setChampions([]);
      return;
    }

    // Fetch Riot data
    fetchSummonerData(gameName, tagLine);
  }

  // =========================
  // Render UI
  // =========================
  return (
    <main className={styles.page}>

      <h1 className={styles.pageTitle}>Summoner Scout</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          value={summonerInput}
          onChange={(event) =>
            setSummonerInput(event.target.value)
          }
          placeholder="Enter summoner as gameName#tagLine"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
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
    
      {/* Results */}
      {summoner && (
        <><section className={styles.summonerCardResults}>
          <SummonerCard summoner={summoner} />
        </section>
        
        <section className={styles.ChampionListResults}>
            <ChampionList
              champions={champions}
              championNames={championNames}
              getChampionIconUrl={(championId) => getChampionIconUrl(ddragonVersion, championId, championImageIds)} />
        </section></>
      )}

    </main>
  );
}