import { useEffect, useState } from "react";
import { getChampionMetaData } from "@/lib/ddragon";

export function useChampionMetadata() {
    const [ddragonVersion, setDdragonVersion] = useState("");
    const [championNames, setChampionNames] = useState<Record<number, string>>({});
    const [championImageIds, setChampionImageIds] = useState<Record<number, string>>({});
    const [championImageIdsByName, setChampionImageIdsByName] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            const metadata = await getChampionMetaData();
            setDdragonVersion(metadata.ddragonVersion);
            setChampionNames(metadata.championNames);
            setChampionImageIds(metadata.championImageIds);
            setChampionImageIdsByName(metadata.championImageIdsByName);
            setLoading(false);
        }
        load();
    }, []);

    return { ddragonVersion, championNames, championImageIds, championImageIdsByName, loading };
}
