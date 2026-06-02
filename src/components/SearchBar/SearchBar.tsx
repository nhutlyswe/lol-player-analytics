import styles from "./SearchBar.module.css";

type Props = {
    gameName: string;
    tagLine: string;
    onGameNameChange: (value: string) => void;
    onTagLineChange: (value: string) => void;
    onSubmit: () => void;
}

export default function SearchBar({
    gameName,
    tagLine,
    onGameNameChange,
    onTagLineChange,
    onSubmit,
}: Props) {
    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input className={styles.searchInput}
                type="text"
                value={gameName}
                onChange={(event) =>
                    onGameNameChange(event.target.value)
                }
                placeholder="Game Name"
            />

            <input className={styles.searchInput}
                type="text"
                value={tagLine}
                onChange={(event) =>
                    onTagLineChange(event.target.value)
                }
                placeholder="Tag Line"
            />
            <button type="submit" className={styles.searchButton}>
                Scout
            </button>

        </form>
    )
}