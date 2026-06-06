"use client";

// Styles
import styles from "./page.module.css";

// React
import { useState } from "react";

// Components
import SearchBar from "@/components/SearchBar/SearchBar";
import SummonerCard from "@/components/SummonerCard/SummonerCard";
import ChampionList from "@/components/ChampionList/ChampionList";

// Types
import { Summoner } from "@/types/summoner";
import { Champion } from "@/types/champion";

// Utils
import { useChampionMetadata } from "@/hooks/useChampionMetadata";
import { getChampionIconUrl } from "@/lib/ddragon";

export default function Home() {

  // Search State
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

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
  function handleSearchSubmit() {
    const trimmedGameName = gameName.trim();
    const trimmedTagLine = tagLine.trim();
    if (!trimmedGameName || !trimmedTagLine) {
      setError("Please enter a valid summoner name and tag line");
      return;
    }
    fetchSummonerData(trimmedGameName, trimmedTagLine);
  }

  // =========================
  // Render UI
  // =========================
  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>Summoner Scout</h1>
      {/* Search Form */}
      <section className={styles.searchSection}>
        <SearchBar
          gameName={gameName}
          tagLine={tagLine}
          onGameNameChange={setGameName}
          onTagLineChange={setTagLine}
          onSubmit={handleSearchSubmit}
        />
      </section>

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
        <><section>
          <SummonerCard summoner={summoner} />
        </section>
        <section>
            <ChampionList
              champions={champions}
              championNames={championNames}
              getChampionIconUrl={(championId) => getChampionIconUrl(ddragonVersion, championId, championImageIds)} />
        </section></>
      )}
    </main>
  );
}