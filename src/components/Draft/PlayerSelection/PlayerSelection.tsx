"use client";

import { useState } from "react";

import { Role, TeamSide } from "@/types/draft";

import styles from "./PlayerSelection.module.css";

type Props = {
    initialTeam?: TeamSide;
    initialRole?: Role;
    onSubmit: (team: TeamSide, role: Role) => void;
};

const teamSides: TeamSide[] = ["blue", "red"];
const roles: Role[] = ["top", "jungle", "mid", "adc", "support"];

export default function PlayerSelection({
    initialTeam = "blue",
    initialRole = "top",
    onSubmit,
}: Props) {
    const [team, setTeam] = useState<TeamSide>(initialTeam);
    const [role, setRole] = useState<Role>(initialRole);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit(team, role);
    }

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Choose team and role</legend>

                <div className={styles.row}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="team-side">
                            Team side
                        </label>
                        <select
                            className={styles.select}
                            id="team-side"
                            value={team}
                            onChange={(event) => setTeam(event.target.value as TeamSide)}
                        >
                            {teamSides.map((side) => (
                                <option key={side} value={side}>
                                    {side === "blue" ? "Blue" : "Red"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="player-role">
                            Role
                        </label>
                        <select
                            className={styles.select}
                            id="player-role"
                            value={role}
                            onChange={(event) => setRole(event.target.value as Role)}
                        >
                            {roles.map((roleOption) => (
                                <option key={roleOption} value={roleOption}>
                                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className={styles.button} type="submit">
                        Select player slot
                    </button>
                </div>
            </fieldset>
        </form>
    );
}
