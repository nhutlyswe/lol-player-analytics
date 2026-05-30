import { Summoner } from "@/types/summoner";

type Props = {
    summoner: Summoner;
}

export default function SummonerCard({
    summoner
}: Props) {
    return (
        <section>
            <h2>Summoner Preview</h2>
            <p>
            <strong>Name:</strong>
            {" "}
            {summoner.gameName}#{summoner.tagLine}
          </p>
        </section>
    )
}


