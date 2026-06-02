import { Summoner } from "@/types/summoner";
import styles from "./SummonerCard.module.css";

type Props = {
    summoner: Summoner;
}

export default function SummonerCard({
    summoner
}: Props) {
    return (
        <section className={styles.summonerCardResults}>
            <h2>Summoner Preview</h2>
            <p>
                <strong>Name:</strong>{" "}
                {summoner.gameName} #{summoner.tagLine}
                </p>

                <p>
                <strong>Solo/Duo Rank:</strong>{" "}
                {summoner.rankSolo}
            </p>
        </section>
    )
}


