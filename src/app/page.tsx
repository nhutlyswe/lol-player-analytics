"use client";

// React hooks:
// useState -> stores data that can change over time
// useEffect -> run side effects like API calls after render
import { useState, useEffect } from "react";

import { Summoner } from "@/types/summoner";

export default function Home() {

  // React state:
  // first value = current state
  // second value = function to update state

  // Stores what the user types into the input field
  const [summoner, setSummoner] = useState("");

  // Stores the submitted summoner name after form submission
  // We separate this from "summoner" so typing does not instantly update results
  const [submittedName, setSubmittedName] = useState("");

  // Stores champion mastery data returned from our API route
  const [champions, setChampions] = useState([]);

  // Stores any error message we want to display to the user
  const [error, setError] = useState("");

  // Used to show loading UI while API request is in progress
  const [loading, setLoading] = useState(false);

  // Lookup table:
  // championId -> champion name
  //
  // Example:
  // {
  //   266: "Aatrox"
  // }
  const [championNames, setChampionNames] = useState<Record<number, string>>({});

  // Current Data Dragon version from Riot
  // Needed to build champion image URLs
  const [ddragonVersion, setDdragonVersion] = useState("");

  // Lookup table:
  // championId -> champion image id
  //
  // Example:
  // {
  //   266: "Aatrox"
  // }
  const [championImageIds, setChampionImageIds] = useState<Record<number, string>>({});

  // useEffect runs AFTER component renders
  //
  // [] dependency array means:
  // Run ONLY once when component first loads
  //
  // We use this to preload champion metadata
  useEffect(() => {

    async function loadChampionNames() {

      // Fetch Riot Data Dragon versions
      // versions[0] is latest version
      const versionsResponse = await fetch(
        "https://ddragon.leagueoflegends.com/api/versions.json"
      );

      const versions = await versionsResponse.json();

      const latest = versions[0];

      // Save latest version into React state
      setDdragonVersion(latest);

      // Fetch all champion metadata
      const championsResponse = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`
      );

      const championsData = await championsResponse.json();

      // Temporary lookup tables
      const nameMap: Record<number, string> = {};
      const imageMap: Record<number, string> = {};

      // Convert Riot champion data into easier lookup tables
      //
      // We use Object.values because Riot returns an object instead of array
      for (const champ of Object.values(championsData.data) as {
        key: string;
        id: string;
        name: string;
      }[]) {

        // champion numeric id -> champion display name
        nameMap[Number(champ.key)] = champ.name;

        // champion numeric id -> image id
        imageMap[Number(champ.key)] = champ.id;
      }

      // Save lookup tables into React state
      setChampionNames(nameMap);
      setChampionImageIds(imageMap);
    }

    loadChampionNames();

  }, []);

  // Build champion icon URL dynamically
  //
  // Example result:
  // https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/Ahri.png
  function getChampionIconUrl(championId: number) {

    const imageId = championImageIds[championId];

    // Guard clause:
    // If data is missing, return null early
    if (!imageId || !ddragonVersion) return null;

    return `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${imageId}.png`;
  }

  // Fetch summoner data from our Next.js API route
  //
  // Flow:
  // User submits form
  // -> frontend calls /api/summoner
  // -> route.ts calls Riot API
  // -> route returns JSON
  // -> frontend updates React state
  async function fetchSummonerData(gameName: string, tagLine: string) {

    // Start loading state
    setLoading(true);

    // Clear old errors before new request
    setError("");

    try {

      // Call our backend API route
      const response = await fetch(
        `/api/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
      );

      const data = await response.json();

      // If request failed:
      // clear old data + show error
      if (!response.ok) {

        setChampions([]);

        setError(data.error || "Failed to fetch summoner data");

        return;
      }

      // Save returned champion data into React state
      //
      // React rerenders automatically after state changes
      setChampions(data.champions || []);

    } catch {

      // Handles:
      // network errors
      // server crashes
      // unexpected failures
      setChampions([]);

      setError(
        "Failed to fetch summoner data. Please check the name and tag line and try again."
      );

    } finally {

      // finally always runs:
      // success OR failure
      setLoading(false);
    }
  }

  // Handles form submission
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    // Prevent browser page refresh
    event.preventDefault();

    // Remove extra spaces from user input
    const trimmed = summoner.trim();

    // Split "name#tag"
    //
    // Example:
    // Faker#KR1
    //
    // becomes:
    // gameName = Faker
    // tagLine = KR1
    const [gameName, tagLine] = trimmed.split("#");

    // Validate input format
    if (!gameName || !tagLine) {

      setError(
        "Please enter a valid summoner name in the format 'Name#TagLine'"
      );

      setChampions([]);

      return;
    }

    // Start async fetch request
    fetchSummonerData(gameName, tagLine);

    // Save submitted name separately from input state
    setSubmittedName(trimmed);
  }

  // JSX = UI returned by component
  //
  // React rerenders this whenever state changes
  return (
    <main>

      <h1>League Analytics</h1>

      {/* Form submission triggers handleSubmit */}
      <form onSubmit={handleSubmit}>

        <input
          value={summoner}

          // Controlled input:
          // React state controls displayed value
          onChange={(event) => setSummoner(event.target.value)}

          placeholder="Enter summoner as gameName#tagLine"
        />

        <button type="submit">Search</button>

      </form>

      {/* Conditional rendering */}
      {/* Only show loading text if loading === true */}
      {loading && <p>Loading...</p>}

      {/* Only show error if error string exists */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show submitted name after search */}
      {submittedName && <p>Searching for: {submittedName}</p>}

      {/* Only render results section after submission */}
      {submittedName && (

        <section>

          <h2>Summoner preview</h2>

          <p>
            <strong>Name:</strong> {submittedName}
          </p>

          <h3>Top Champions</h3>

          <ul>

            {/* Render list dynamically using map() */}
            {champions.map((champion: any) => {

              // Convert championId -> readable name
              const name =
                championNames[champion.championId] ??
                `Unknown (${champion.championId})`;

              // Generate icon URL
              const iconUrl = getChampionIconUrl(champion.championId);

              return (

                // key helps React track list items efficiently
                <li
                  key={champion.championId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >

                  {/* Only render image if icon URL exists */}
                  {iconUrl && (
                    <img
                      src={iconUrl}
                      alt={name}
                      width={48}
                      height={48}
                    />
                  )}

                  <span>
                    {name} - Points: {champion.championPoints}
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