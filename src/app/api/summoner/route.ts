import { NextResponse } from 'next/server';

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

    try {
        const url = new URL(request.url);
        const gameName = url.searchParams.get('gameName');
        const tagLine = url.searchParams.get('tagLine');

        if (!gameName?.trim()) {
            return NextResponse.json(
                { error: 'Missing game name' },
                { status: 400 }
            );
        }

        if (!tagLine?.trim()) {
            return NextResponse.json(
                { error: 'Missing tag line' },
                { status: 400 }
            );
        }

        const apiKey = process.env.RIOT_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
        }

        const regionRoutingValue = "americas.api.riotgames.com";
        const platformRoutingValue = "na1.api.riotgames.com";

        const accountResponse = await fetch(
            `https://${regionRoutingValue}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
            {
                headers: {
                    'X-Riot-Token': apiKey
                }
            }
        );

        if (!accountResponse.ok) {
            const riotError = mapRiotError(accountResponse.status, 'Summoner');
            return NextResponse.json({ error: riotError.error }, { status: riotError.status });
        }

        const accountData = await accountResponse.json();

        const puuid = accountData.puuid;

        if (!puuid) {
            return NextResponse.json({ error: 'PUUID not found for summoner' }, { status: 500 });
        }
        const championMasteryResponse = await fetch(
            `https://${platformRoutingValue}/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}`,
            {
                headers: {
                    'X-Riot-Token': apiKey
                }
            }
        );

        if (!championMasteryResponse.ok) {
            const riotError = mapRiotError(championMasteryResponse.status, 'Champion mastery data');
            return NextResponse.json({ error: riotError.error }, { status: riotError.status });
        }

        const championMasteryData = await championMasteryResponse.json();

        return NextResponse.json({ champions: championMasteryData });
    } catch (error) {
        console.error("Summoner route error:", error);
        return NextResponse.json({ error: 'Unexpected server error while fetching summoner data' }, { status: 500 });
    }

}