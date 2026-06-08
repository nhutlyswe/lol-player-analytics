import { ChampionMastery } from "@/types/champion";
import styles from "./ChampionList.module.css";

type Props = {
    championMasteries: ChampionMastery[];
    championNames: Record<number, string>;
    getChampionIconUrl: (championId: number) => string | null;
}

export default function ChampionList({
    championMasteries,
    championNames,
    getChampionIconUrl,
}: Props) {
    if (championMasteries.length === 0) {
        return null;
    }

    return (
        <section className={styles.ChampionListResults}>
            <h3>Top Champions</h3>
            <ul>
                {championMasteries.map((championMastery) => {
                    const name = championNames[championMastery.championId] ?? `Unknown (${championMastery.championId})`;
                    const iconUrl = getChampionIconUrl(championMastery.championId);

                    return (
                        <li key={championMastery.championId} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                            {iconUrl && (<img src={iconUrl} alt={name} width={48} height={48} style={{ marginRight: "8px" }} />)}
                            <span>{name} - Points: {championMastery.championPoints}</span>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
