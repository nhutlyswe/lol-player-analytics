import { Champion } from "./champion";

export interface Summoner{
    name: string;
    rank: string;
    champions: Champion[];
}