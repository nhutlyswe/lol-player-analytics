"use client";

// Styles
import styles from "./page.module.css";

// React
import { useEffect, useState } from "react";

// Components
import ChampionList from "@/components/ChampionList";
import SummonerCard from "@/components/SummonerCard";

// Types
import { Champion } from "@/types/champion";
import { Summoner } from "@/types/summoner";

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
  const [ddragonVersion, setDdragonVersion] = useState("");

  const [championNames, setChampionNames] =
    useState<Record<number, string>>({});

  const [championImageIds, setChampionImageIds] =
    useState<Record<number, string>>({});

  // =========================
  // Effects
  // =========================
  // Runs after component renders
  useEffect(() => {

    // Loads Riot champion metadata once on startup
    async function fetchChampionsMetadata() {

      // Get latest Data Dragon version
      const versionsResponse = await fetch(
        "https://ddragon.leagueoflegends.com/api/versions.json"
      );

      const versions = await versionsResponse.json();
      const latest = versions[0];

      setDdragonVersion(latest);

      // Get champion metadata
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
    fetchChampionsMetadata();
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
              champions={champions.slice(0, 5)}
              championNames={championNames}
              getChampionIconUrl={getChampionIconUrl} />
        </section></>
      )}

    </main>
  );
}