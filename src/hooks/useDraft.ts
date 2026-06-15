import { useState } from 'react';
import { Draft, TeamSide, Role } from "../types/draft";

export function useDraft() {
    const [draft, setDraft] = useState<Draft>({
        blue: { 
            top: null, 
            jungle: null, 
            mid: null, 
            adc: null, 
            support: null },

        red: { 
            top: null, 
            jungle: null, 
            mid: null, 
            adc: null, 
            support: null },
    });

    function updateDraft(
        teamSide: TeamSide, 
        role: Role, 
        championName: string | null) 
    {
        setDraft((prevDraft) => ({
            ...prevDraft,
            [teamSide]: {
                ...prevDraft[teamSide],
                [role]: championName,
            },
        }));
    }

    return { draft, updateDraft };
}
