export interface TopChampion {
    name: string;
    gamesPlayed: number;
    winRate: number;
    kda: number;
}

export interface SummonerStats {
    name: string;
    rank: string;
    topChampions: TopChampion[];
}