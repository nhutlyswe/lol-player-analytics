import { Draft, TeamSide, Role } from "../types/draft";

export function useRecommendations(
    draft: Draft, 
    teamSide: TeamSide, 
    role: Role
) {
    const enemySide: TeamSide = teamSide === "blue" ? "red" : "blue";
    const currentTeamPicks = Object.values(draft[teamSide]).filter(Boolean)
    const currentEnemyPicks = Object.values(draft[enemySide]).filter(Boolean)
    

    return {
        recommendations: []
    };
}