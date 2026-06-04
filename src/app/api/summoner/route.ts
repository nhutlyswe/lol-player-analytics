import { NextResponse } from 'next/server';
import { getAccountByRiotId, getChampionMasteryByPuuid, getRankFlexByPuuid, getRankFlexWinrateByPuuid, getRankSoloByPuuid, getRankSoloWinrateByPuuid, getRolesInfoFromRankSoloRecentMatches, getLeagueEntriesByPuuid, getRankInfoByPuuid } from '@/lib/riot';

function mapRiotError(status: number, resource: string) {
    switch (status) {
        case 404:
            return { error: `${resource} not found. Check game name and tag line.`, status: 404 };
        case 429:
            return { error: 'Rate limit reached. Please try again in a moment.', status: 429 };
        case 401:
            return { error: 'Unable to authenticate with Riot API.', status: 401 };
    }
    return { error: `Failed to fetch ${resource.toLowerCase()} from Riot API.`, status: 502 };
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const gameName = url.searchParams.get('gameName');
    const tagLine = url.searchParams.get('tagLine');

    if (!gameName?.trim() || !tagLine?.trim()) {
        return NextResponse.json(
            { error: "Missing game name or tag line" },
            { status: 400 }
        );
    }

    try {
        const account = await getAccountByRiotId(gameName, tagLine);
        const puuid = account.puuid;
        
        const [championMastery, roleCounts, rankInfo] = await Promise.all([
            getChampionMasteryByPuuid(puuid),
            getRolesInfoFromRankSoloRecentMatches(puuid, 20),
            getRankInfoByPuuid(puuid),
        ]);


        return NextResponse.json({ 
            summoner: {
                gameName: account.gameName,
                tagLine: account.tagLine,
                puuid: account.puuid,
                rankSolo: rankInfo.solo,
                rankFlex: rankInfo.flex,
                winrateSolo: rankInfo.winrateSolo,
                winrateFlex: rankInfo.winrateFlex,
                roleCounts: roleCounts ?? {},
            },
            champions: championMastery,
        });
    } catch (error) {
        console.error("Summoner route error:", error);
        return NextResponse.json({ error: 'Unexpected server error while fetching summoner data' }, { status: 500 });
    }

}