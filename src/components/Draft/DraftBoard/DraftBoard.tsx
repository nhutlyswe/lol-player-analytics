"use client";

import { useState } from "react";
import { TeamSide, Role } from "../../../types/draft";
import { useDraft } from "@/hooks/useDraft";
import TeamColumn from "../TeamColumn/TeamColumn";
import ChampionPicker from "../ChampionPicker/ChampionPicker";
import styles from "./DraftBoard.module.css";

export default function DraftBoard() {
    const { draft, updateDraft } = useDraft();

    const [selectedSlot, setSelectedSlot] = useState<{
        team: TeamSide;
        role: Role;
    } | null>(null);

    function onSelectRole(team: TeamSide, role: Role) {
        setSelectedSlot({ team, role });
    }

    function handleChampionSelect(champion: string) {
        if (!selectedSlot) return;

        updateDraft(selectedSlot.team, selectedSlot.role, champion);
        setSelectedSlot(null);
    }

    return (
        <section>
            <h3 className={styles.title}>Current Draft</h3>

            <div className={styles.board}>
                {/* Blue Team */}
                <div className={styles.teamColumn}>
                    <TeamColumn
                        teamSide="blue"
                        draft={draft.blue}
                        onSelectSlot={onSelectRole}
                    />
                </div>

                {/* Center Picker */}
                <div className={styles.center}>
                    {selectedSlot && (
                        <>
                            <ChampionPicker onSelect={handleChampionSelect} />

                            <p className={styles.selected}>
                                Selected: {selectedSlot.team} - {selectedSlot.role}
                            </p>
                        </>
                    )}
                </div>

                {/* Red Team */}
                <div className={styles.teamColumn}>
                    <TeamColumn
                        teamSide="red"
                        draft={draft.red}
                        onSelectSlot={onSelectRole}
                    />
                </div>
            </div>
        </section>
    );
}