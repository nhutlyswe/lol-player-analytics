import { REGION_ROUTING, PLATFORM_ROUTING } from "./riotConfig";

async function riotFetch(url: string): Promise<any> {
    const apiKey = process.env.RIOT_API_KEY;
    if (!apiKey) {
        throw new Error("Missing Riot API key");
    }

    const response = await fetch(url, {
        headers: {
            "X-Riot-Token": apiKey,
        },
    });

    if (!response.ok) {
        throw new Error(
            `Riot API request failed: ${response.status} ${response.statusText}`
        );
    }
    return response.json();
}

export async function getAccountByRiotId(gameName: string, tagLine: string) {
    const data = await riotFetch(
        `https://${REGION_ROUTING}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    const puuid = data.puuid;
    
    if (!puuid) {
        throw new Error("PUUID not found for summoner");
    }
    return data;
}

export async function getChampionMasteryByPuuid(puuid: string, count: number = 5) {
    const data = await riotFetch(
        `https://${PLATFORM_ROUTING}/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}/top?count=${count}`
    );
    return data;
}

export async function getRankSoloByPuuid(puuid: string) {
    const data = await riotFetch(
        `https://${PLATFORM_ROUTING}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`
    );
    const solo = data.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");
    return solo ? `${solo.tier} ${solo.rank}` : "UNRANKED";
}