export type TeamSide = "blue" | "red";
export type Role = "top" | "jungle" | "mid" | "adc" | "support";
export type TeamDraft = Record<Role, string | null>;

export interface Draft {
    blue: TeamDraft;
    red: TeamDraft;
}