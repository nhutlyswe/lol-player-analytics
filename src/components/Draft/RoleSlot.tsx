import { Role } from "../../types/draft";

type Props = {
    role: Role;
    champion: string | null;
    onClick: () => void;
}

export default function RoleSlot({
    role,
    champion,
    onClick
}: Props) {

    return (
        <div onClick={onClick}>
            {role}: {champion ?? "TBD"}
        </div>
    )
}