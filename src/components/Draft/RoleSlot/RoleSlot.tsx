import { Role } from "../../../types/draft";

import styles from "./RoleSlot.module.css";

type Props = {
    role: Role;
    champion: string | null;
    championIconUrl: string | null;
    isSelected: boolean;
    onClick: () => void;
};

export default function RoleSlot({
    role,
    champion,
    championIconUrl,
    isSelected,
    onClick
}: Props) {

    const isEmpty = !champion;

    return (
        <div
            className={`
                ${styles.slot} 
                ${isEmpty ? "" : styles.filled}
                ${isSelected ? styles.selected: ""}
            `}
            onClick={onClick}
        >
            <div className={styles.role}>
                {role}
            </div>

            <div className={styles.championContainer}>
                {championIconUrl ? (
                    <img
                        src={championIconUrl}
                        alt={champion ?? "Champion icon"}
                        className={styles.championIcon}
                    />
                ) : null}

                <div className={isEmpty ? styles.empty : styles.champion}>
                    {champion ?? "TBD"}
                </div>
            </div>
        </div>
    );
}
