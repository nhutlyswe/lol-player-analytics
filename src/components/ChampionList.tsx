type Champion = {
    championId: number;
    championPoints: number;
}

type Props = {
    champions: Champion[];
    championNames: Record<number, string>;
    getChampionIconUrl: (championId: number) => string | null;
}

export default function ChampionList({
    champions,
    championNames,
    getChampionIconUrl,
}: Props) {

    if (champions.length === 0) {
        return null;
    }

    return (
        <section>
            <h3>Top Champions</h3>
            <ul>
                {champions.map((champion) => {
                    const name = championNames[champion.championId] ?? `Unknown (${champion.championId})`;
                    const iconUrl = getChampionIconUrl(champion.championId);

                    return (
                        <li key={champion.championId} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                            {iconUrl && (<img src={iconUrl} alt={name} width={48} height={48} style={{ marginRight: "8px" }} />)}
                            <span>{name} - Points: {champion.championPoints}</span>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
