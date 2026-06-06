import { TeamDraft, TeamSide, Role } from "@/types/draft";
import RoleSlot from "./RoleSlot";

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
        <div>
            <h4>{teamSide.toUpperCase()} TEAM</h4>

            {roles.map((role) => (
                <RoleSlot
                    key = {role}
                    role = {role}
                    champion={draft[role]}
                    onClick={() => onSelectSlot(teamSide, role)}
                />
            ))}
        </div>
    );
}

