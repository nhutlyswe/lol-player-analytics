import styles from './page.module.css';
import DraftBoard from "@/components/Draft/DraftBoard/DraftBoard";

export default function DraftPage() {
    return (
        <main className={styles.page}>
            <h1 className={styles.pageTitle}>Draft Assistant</h1>

            <DraftBoard />
        </main>
    );
}