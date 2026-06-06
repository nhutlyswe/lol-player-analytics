import { useState } from "react";
import { Draft, TeamSide, Role } from "../../types/draft";
import TeamColumn from "./TeamColumn";

type Props = {
    currentDraft: Draft;
}

export default function DraftBoard({
    currentDraft
}: Props) {

    const [selectedSlot, setSelectedSlot] = useState<{
        team: TeamSide;
        role: Role;
    } | null> (null);

    function onSelectRole(team: TeamSide, role: Role) {
        setSelectedSlot( {team, role} );
    }

    return (
        <section>
            <h3>Current Draft</h3>
            
            <div>
                <TeamColumn
                    teamSide="blue"
                    draft={currentDraft.blue}
                    onSelectSlot={onSelectRole}
                />

                <TeamColumn
                    teamSide="red"
                    draft={currentDraft.red}
                    onSelectSlot={onSelectRole}
                />
            </div>

            {selectedSlot && (
                <div>
                    <p>
                        Selected: {selectedSlot.team} - {selectedSlot.role}
                    </p>
                </div>
            )}

        </section>
    )
}


