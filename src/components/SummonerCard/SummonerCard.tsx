import { Summoner } from "@/types/summoner";
import styles from "./SummonerCard.module.css";

type Props = {
    summoner: Summoner;
}

export default function SummonerCard({
    summoner
}: Props) {

    const summonerName = `${summoner.gameName}#${summoner.tagLine}`;
    const soloQueueInfo = `${summoner.rankSolo} | Win Rate: ${summoner.winrateSolo}`;
    const flexQueueInfo = `${summoner.rankFlex} | Win Rate: ${summoner.winrateFlex}`;
    const roleInfo = Object.entries(summoner.roleCounts)
        .filter(([_, count]) => count > 0)
        .map(([role, count]) => `${role} (${count})`)
        .join(", ") || "N/A";

    return (
        <section className={styles.summonerCardResults}>
            <h2> <strong>SUMMONER</strong></h2>
            <p>
                <strong>Name:</strong>{" "}
                {summonerName}
            </p>

            <p>
                <strong>Soloqueue:</strong>{" "}
                {soloQueueInfo}
            </p>

            <p>
                <strong>Flex:</strong>{" "}
                {flexQueueInfo}
            </p>

            <p>
                <strong>Most Played Roles (Last 20 Games):</strong>{" "}
                {roleInfo}
            </p>
        </section>
    )
}


