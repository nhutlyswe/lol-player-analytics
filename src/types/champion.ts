export interface Champion {
    championId: number;
    championPoints: number;
}

export interface ChampionStats {
    name: string;
    gamesPlayed: number;
    winRate: number;
    kda: number;
}