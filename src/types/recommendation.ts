import { Role } from "./draft";

export type ChampionProfile = {
    champion: string;
    roles: Role[];
    suggestedTrais: Record<string, number>;
};

export type Recommendation = {
    champion: string;
    score: number;
    synergyScore: number;
};