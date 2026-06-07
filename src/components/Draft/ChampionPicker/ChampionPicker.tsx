"use client";

import styles from "./ChampionPicker.module.css";

type Props = {
    onSelect: (champion: string) => void;
};

const champions = [
    "Ahri",
    "Yasuo",
    "Zed",
    "Lux",
    "Jinx",
    "Garen",
    "Lee Sin",
    "Thresh",
];

export default function ChampionPicker({ onSelect }: Props) {
    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Select a Champion</h4>

            <div className={styles.grid}>
                {champions.map((champion) => (
                    <button
                        key={champion}
                        className={styles.button}
                        onClick={() => onSelect(champion)}
                    >
                        {champion}
                    </button>
                ))}
            </div>
        </div>
    );
}