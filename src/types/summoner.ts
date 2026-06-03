import { Champion } from "./champion";

export interface Summoner{
    gameName: string;
    tagLine: string;
    puuid: string;
    rankSolo: string;
    rankFlex: string;
    winrateSolo: number;
    winrateFlex: number;
    roleCounts: Record<string, number>;
    championPool: Champion[];
}