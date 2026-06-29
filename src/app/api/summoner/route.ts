import { NextResponse } from 'next/server';
import { getAccountByRiotId, getChampionMasteryByPuuid, getRolesInfoFromRankSoloRecentMatches, getRankInfoByPuuid } from '@/lib/riot';

function mapRiotError(status: number, resource: string) {
    switch (status) {
        case 400:
            return { error: 'Bad Request. There is a syntax error in the request and the request has therefore been denied.', status: 400 };
        case 401:
            return { error: 'Unauthorized. The request being made did not contain the necessary authentication credentials (e.g., an API key) and therefore the client was denied access.', status: 401 };
        case 403:
            return { error: 'Forbidden. The server understood the request but refuses to authorize it.', status: 403 };
        case 404:
            return { error: `Not Found. The server has not found a match for the API request being made.`, status: 404 };
        case 415:
            return { error: `Unsupported Media Type. The server is refusing to service the request because the body of the request is in a format that is not supported.`, status: 415 };
        case 429:
            return { error: 'Rate Limit Exceeded. The application has exhausted its maximum number of allotted API calls allowed for a given duration.', status: 429 };
        case 500:
            return { error: 'Internal Server Error. An unexpected condition or exception which prevented the server from fulfilling an API request.', status: 500 };
        case 503:
            return { error: 'Service Unavailable. The server is currently unavailable to handle requests because of an unknown reason.', status: 503 };
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
            getRolesInfoFromRankSoloRecentMatches(puuid, 5),
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
        const status = error instanceof Response ? error.status : 500;
        const mappedError = mapRiotError(status, 'Summoner');
        return NextResponse.json( mappedError, { status: mappedError.status });
    }
}
