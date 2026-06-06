type Props = {
    onSelect: ( champion: string) => void;
};

const champions = [
    "Ahri",
    "Yasuo",
    "Zed",
    "Lux",
    "Jinx",
    "Garen",
    "Lee Sin",
    "Thresh",
]

export default function ChampionPicker({ onSelect }: Props) {
    return (
        <div>
            <h4>Select a Champion</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {champions.map((champion) => (
                    <button
                        key={champion}
                        onClick={() => onSelect(champion)}
                    >
                        {champion}
                    </button>
                ))}
            </div>
        </div>
    );
}