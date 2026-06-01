import {DATA_DRAGON_ROUTING} from "./riotConfig";

export async function getLatestDdragonVersion(): Promise<string> {
    const response = await fetch(`https://${DATA_DRAGON_ROUTING}/api/versions.json`);
    const data = await response.json();
    return data[0];
}

export async function getChampionData(version: string) {
    const response = await fetch(`https://${DATA_DRAGON_ROUTING}/cdn/${version}/data/en_US/champion.json`);
    const data = await response.json();
    return data.data;
}

export async function getChampionMetaData() {
    const version = await getLatestDdragonVersion();
    const championData = await getChampionData(version);
    
    const championNames: Record<number, string> = {};
    const championImageIds: Record<number, string> = {};

    for (const champ of Object.values(championData) as {
        key: string;
        id: string;
        name: string;
    }[]) {
        championNames[Number(champ.key)] = champ.name;
        championImageIds[Number(champ.key)] = champ.id;
    }

    return {
        version,
        championNames,
        championImageIds,
    };
}

export function getChampionIconUrl(
    version: string,
    championImageId: string
): string {
    return `https://${DATA_DRAGON_ROUTING}/cdn/${version}/img/champion/${championImageId}.png`;
}


