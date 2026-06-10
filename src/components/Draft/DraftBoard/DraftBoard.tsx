"use client";

import { useState } from "react";
import { TeamSide, Role } from "../../../types/draft";
import { useDraft } from "@/hooks/useDraft";
import { useChampionMetadata } from "@/hooks/useChampionMetadata";
import { getChampionIconUrlByName } from "@/lib/ddragon";
import TeamColumn from "../TeamColumn/TeamColumn";
import ChampionPicker from "../ChampionPicker/ChampionPicker";
import styles from "./DraftBoard.module.css";

export default function DraftBoard() {
    const { draft, updateDraft } = useDraft();
    const { ddragonVersion, championImageIdsByName } = useChampionMetadata();

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

    function getChampionIconUrl(champion: string | null) {
        if (!champion || !ddragonVersion) return null;
        return getChampionIconUrlByName(ddragonVersion, champion, championImageIdsByName);
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
                        selectedSlot={selectedSlot}
                        onSelectSlot={onSelectRole}
                        getChampionIconUrl={getChampionIconUrl}
                    />
                </div>

                {/* Center Picker */}
                <div className={styles.center}>
                    <ChampionPicker onSelect={handleChampionSelect} />
                </div>

                {/* Red Team */}
                <div className={styles.teamColumn}>
                    <TeamColumn
                        teamSide="red"
                        draft={draft.red}
                        selectedSlot={selectedSlot}
                        onSelectSlot={onSelectRole}
                        getChampionIconUrl={getChampionIconUrl}
                    />
                </div>
            </div>
        </section>
    );
}