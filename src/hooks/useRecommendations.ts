import { Draft, TeamSide, Role } from "../types/draft";
import championProfilesData from "../../data/championProfiles.json";

type ChampionProfile = {
  champion: string;
  roles: Role[];
  suggestedTraits: Record<string, number>;
};

type Recommendation = {
  champion: string;
  score: number;
  synergyScore: number;
};

export function useRecommendations(
    draft: Draft, 
    teamSide: TeamSide, 
    role: Role
) {
    const enemySide: TeamSide = teamSide === "blue" ? "red" : "blue";
    const currentTeamPicks = Object.values(draft[teamSide]).filter(Boolean) as string[];
    const currentEnemyPicks = Object.values(draft[enemySide]).filter(Boolean) as string[];

    const championProfiles = championProfilesData.champions as unknown as ChampionProfile[];

    const profileByName = championProfiles.reduce((map, profile) => {
        map[profile.champion] = profile;
        return map;
    }, {} as Record<string, ChampionProfile>);

    const currentTeamProfiles = currentTeamPicks
        .map((name) => profileByName[name])
        .filter(Boolean);

    const teamTraitScores: Record<string, number> = {};
    for (const profile of currentTeamProfiles) {
        for (const [trait, value] of Object.entries(profile.suggestedTraits)) {
            teamTraitScores[trait] = (teamTraitScores[trait] || 0) + value;
        }
    }

    const candidates = championProfiles.filter(
        (profile) =>
            profile.roles.includes(role) &&
            !currentTeamPicks.includes(profile.champion) &&
            !currentEnemyPicks.includes(profile.champion)
    );

    const recommendations = candidates.map((candidate) => {
        let synergyScore = 0;
        for (const [trait, value] of Object.entries(candidate.suggestedTraits)) {
        synergyScore += value * (teamTraitScores[trait] ?? 0);
        }
        return { champion: candidate.champion, score: synergyScore, synergyScore };
    });

    recommendations.sort((a, b) => b.score - a.score);

    return { recommendations };
}