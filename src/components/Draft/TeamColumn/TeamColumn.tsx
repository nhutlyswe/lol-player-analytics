import { TeamDraft, TeamSide, Role } from "@/types/draft";
import RoleSlot from "../RoleSlot/RoleSlot";
import styles from "./TeamColumn.module.css";

type Props = {
    teamSide: TeamSide;
    draft: TeamDraft;
    onSelectSlot: (team: TeamSide, role: Role) => void;
};

export default function TeamColumn({
    teamSide,
    draft,
    onSelectSlot
}: Props) {

    const roles: Role[] = ["top", "jungle", "mid", "adc", "support"];

    return (
        <div className={styles.column}>
            <h4
                className={`${styles.title} ${
                    teamSide === "blue" ? styles.blue : styles.red
                }`}
            >
                {teamSide.toUpperCase()}
            </h4>

            <div className={styles.slots}>
                {roles.map((role) => (
                    <RoleSlot
                        key={role}
                        role={role}
                        champion={draft[role]}
                        onClick={() => onSelectSlot(teamSide, role)}
                    />
                ))}
            </div>
        </div>
    );
}