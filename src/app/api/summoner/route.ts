import {NextResponse} from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const gameName = url.searchParams.get('gameName');
    const tagLine = url.searchParams.get('tagLine');
    
    if (!gameName) {
        return NextResponse.json({error: 'Missing game name'}, {status: 400});
    }

    if (!tagLine) {
        return NextResponse.json({error: 'Missing tag line'}, {status: 400});
    }

    const apiKey = process.env.RIOT_API_KEY;
    if (!apiKey) {
        return NextResponse.json({error: 'Missing API key'}, {status: 500});
    }

    
    const summonerResponse = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        {
            headers: {
                'X-Riot-Token': apiKey
            }
        }
    );
    
    const summonerData = await summonerResponse.json();




}