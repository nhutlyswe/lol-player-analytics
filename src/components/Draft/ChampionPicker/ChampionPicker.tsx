"use client";

import styles from "./ChampionPicker.module.css";
import { useChampionMetadata } from "@/hooks/useChampionMetadata";
import { getChampionIconUrl } from "@/lib/ddragon";

type Props = {
    onSelect: (champion: string) => void;
};

export default function ChampionPicker({ onSelect }: Props) {
    const { ddragonVersion, championNames, championImageIds, loading } = useChampionMetadata();

    if (loading) {
        return (
            <div className={styles.container}>
                <h4 className={styles.title}>Select a Champion</h4>
                <p>Loading champions...</p>
            </div>
        );
    }

    const championIds = Object.keys(championNames)
        .map(Number)
        .sort((a, b) => {
            const nameA = championNames[a] ?? "";
            const nameB = championNames[b] ?? "";
            return nameA.localeCompare(nameB);
        });

    if (championIds.length === 0) {
        return (
            <div className={styles.container}>
                <h4 className={styles.title}>Select a Champion</h4>
                <p>No champions available.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Select a Champion</h4>

            <div className={styles.grid}>
                {championIds.map((championId) => {
                    const championName = championNames[championId] ?? `Champion ${championId}`;
                    const iconUrl = getChampionIconUrl(ddragonVersion, championId, championImageIds);

                    return (
                        <button
                            key={championId}
                            className={styles.button}
                            aria-label={championName}
                            onClick={() => onSelect(championName)}
                        >
                            {iconUrl ? (
                                <>
                                    <img
                                        src={iconUrl}
                                        alt={championName}
                                        className={styles.championIcon}
                                    />
                                    <span className={styles.championName}>{championName}</span>
                                </>
                            ) : (
                                <span className={styles.championName}>{championName}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}