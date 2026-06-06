import { Draft, Role } from "../../types/draft";

type Props = {
    currentDraft: Draft;
}

export default function DraftBoard({
    currentDraft
}: Props) {

    const roles: Role[] = ["top", "jungle", "mid", "adc", "support"];

    return (
        <section>
            <h3>Current Draft</h3>
            
            <div>
                <h4>Blue Team</h4>
                {roles.map(role => (
                    <p key = {role}>
                        {role}: {currentDraft.blue[role] ?? "TBD"}
                    </p>
                ))}
            </div>

            <div>
                <h4>Red Team</h4>
                {roles.map(role => (
                    <p key = {role}>
                        {role}: {currentDraft.red[role] ?? "TBD"}
                    </p>
                ))}
            </div>

        </section>
    )

}
