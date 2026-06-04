import { REGION_ROUTING, PLATFORM_ROUTING } from "./riotConfig";
import { cache } from "react";

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
        console.log(await response.text());
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
    const data = await getLeagueEntriesByPuuid(puuid);
    const solo = data.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");
    return solo ? `${solo.tier} ${solo.rank} - ${solo.leaguePoints} LP` : "UNRANKED";
}

export async function getRankFlexByPuuid(puuid: string) {
    const data = await getLeagueEntriesByPuuid(puuid);
    const flex = data.find((entry: any) => entry.queueType === "RANKED_FLEX_SR");
    return flex ? `${flex.tier} ${flex.rank} - ${flex.leaguePoints} LP` : "UNRANKED";
}

export async function getRankSoloWinrateByPuuid(puuid: string) {
    const data = await getLeagueEntriesByPuuid(puuid);
    const winrate = data.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");
    
    if (!winrate) {
        return "N/A";
    }

    const totalGames = winrate.wins + winrate.losses;
    const winRatePercent = ((winrate.wins / totalGames) * 100).toFixed(1);

    return `${winrate.wins}/${winrate.losses} (${winRatePercent}%)`;
}

export const getRankFlexWinrateByPuuid = cache(async (puuid: string) => {
    const data = await getLeagueEntriesByPuuid(puuid);
    const winrate = data.find((entry: any) => entry.queueType === "RANKED_FLEX_SR");

    if (!winrate) {
        return "N/A";
    }

    const totalGames = winrate.wins + winrate.losses;
    const winRatePercent = ((winrate.wins / totalGames) * 100).toFixed(1);

    return `${winrate.wins}/${winrate.losses} (${winRatePercent}%)`;
});

export async function getLeagueEntriesByPuuid(puuid: string) {
    const data = await riotFetch(
        `https://${PLATFORM_ROUTING}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`
    );
    return data;
}

export const getRankInfoByPuuid = cache(async (puuid: string) => {
    const data = await getLeagueEntriesByPuuid(puuid);
    const solo = data.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");
    const flex = data.find((entry: any) => entry.queueType === "RANKED_FLEX_SR");

    return {
        solo: solo ? `${solo.tier} ${solo.rank} - ${solo.leaguePoints} LP` : "UNRANKED",
        winrateSolo: solo ? `${solo.wins}/${solo.losses} (${((solo.wins / (solo.wins + solo.losses)) * 100).toFixed(1)}%)` : "N/A",
        flex: flex ? `${flex.tier} ${flex.rank} - ${flex.leaguePoints} LP` : "UNRANKED",
        winrateFlex: flex ? `${flex.wins}/${flex.losses} (${((flex.wins / (flex.wins + flex.losses)) * 100).toFixed(1)}%)` : "N/A",
    };
});

export async function getRecentRankSoloMatchesByPuuid(puuid: string, count: number = 10): Promise<string[]> {
    const data = await riotFetch(
        `https://${REGION_ROUTING}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?queue=420&count=${count}`
    );
    return data;
}

export const getMatchInfoById = cache(async (matchId: string) => {
    const data = await riotFetch(
        `https://${REGION_ROUTING}/lol/match/v5/matches/${encodeURIComponent(matchId)}`
    );
    return data;
});

export async function getRolesInfoFromRankSoloRecentMatches(
    puuid: string,
    count: number = 10
) {
    const matchIds = await getRecentRankSoloMatchesByPuuid(puuid, count);

    const roleCounts: Record<string, number> = {
        TOP: 0,
        JUNGLE: 0,
        MIDDLE: 0,
        BOTTOM: 0,
        UTILITY: 0,
        UNKNOWN: 0,
    };

    const BATCH_SIZE = 5;

    for (let i = 0; i < matchIds.length; i += BATCH_SIZE) {
        const batch = matchIds.slice(i, i + BATCH_SIZE);
        const matches = await Promise.all(
            batch.map(matchId => getMatchInfoById(matchId))
        );

        for (const matchInfo of matches) {
            const participant = matchInfo.info.participants.find(
                (p: any) => p.puuid === puuid
            );

            if (!participant) { continue;}

            const role = participant.teamPosition || "UNKNOWN";

            if (roleCounts[role] !== undefined) {
                roleCounts[role]++;
            } else {
                roleCounts.UNKNOWN++;
            }
        }
    }

    return roleCounts;
}
