import { Role } from "../../../types/draft";
import styles from "./RoleSlot.module.css";

type Props = {
    role: Role;
    champion: string | null;
    onClick: () => void;
};

export default function RoleSlot({
    role,
    champion,
    onClick
}: Props) {

    const isEmpty = !champion;

    return (
        <div className={styles.slot} onClick={onClick}>
            <div className={styles.role}>
                {role}
            </div>

            <div className={isEmpty ? styles.empty : styles.champion}>
                {champion ?? "TBD"}
            </div>
        </div>
    );
}