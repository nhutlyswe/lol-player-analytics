import { NextResponse } from 'next/server';
import { getAccountByRiotId, getChampionMasteryByPuuid, getRankFlexByPuuid, getRankSoloByPuuid, getRankSoloWinrateByPuuid } from '@/lib/riot';

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
        const championMastery = await getChampionMasteryByPuuid(puuid);
        const rankSolo = await getRankSoloByPuuid(puuid);
        const rankFlex = await getRankFlexByPuuid(puuid);
        const winrateSolo = await getRankSoloWinrateByPuuid(puuid);
        const winrateFlex = await getRankSoloWinrateByPuuid(puuid);

        return NextResponse.json({ 
            summoner: {
                gameName: account.gameName,
                tagLine: account.tagLine,
                puuid: account.puuid,
                rankSolo: rankSolo ?? "UNRANKED",
                rankFlex: rankFlex ?? "UNRANKED",
                winrateSolo: winrateSolo ?? "N/A",
                winrateFlex: winrateFlex ?? "N/A",
            },
            champions: championMastery,
        });
    } catch (error) {
        console.error("Summoner route error:", error);
        return NextResponse.json({ error: 'Unexpected server error while fetching summoner data' }, { status: 500 });
    }

}