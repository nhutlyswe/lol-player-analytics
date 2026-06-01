import {DATA_DRAGON_ROUTING} from "./riotConfig";

export async function getLatestDdragonVersion(): Promise<string> {
    const response = await fetch(`https://${DATA_DRAGON_ROUTING}/api/versions.json`);
    const data = await response.json();
    return data[0];
}

export async function getChampionData(ddragonVersion: string) {
    const response = await fetch(`https://${DATA_DRAGON_ROUTING}/cdn/${ddragonVersion}/data/en_US/champion.json`);
    const data = await response.json();
    return data.data;
}

export async function getChampionMetaData() {
    const ddragonVersion = await getLatestDdragonVersion();
    const championData = await getChampionData(ddragonVersion);

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
        ddragonVersion,
        championNames,
        championImageIds,
    };
}

export function getChampionIconUrl(
    ddragonVersion: string,
    championId: number,
    championImageIds: Record<number, string>
): string | null{
    const championImageId = championImageIds[championId];
    if (!championImageId) {
        return null;
    }
    return `https://${DATA_DRAGON_ROUTING}/cdn/${ddragonVersion}/img/champion/${championImageId}.png`;
}
