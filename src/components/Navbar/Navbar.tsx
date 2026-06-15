"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Navbar.module.css";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>
                <div className={styles.left}>
                    <Link 
                        href="/" 
                        className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
                    >
                        Scout
                    </Link>
                </div>

                <div className={styles.right}>
                    <Link 
                        href="/draft" 
                        className={`${styles.link} ${pathname === "/draft" ? styles.active : ""}`}
                    >
                        Draft Assistant
                    </Link>
                </div>
            </div>
        </nav>
    );
}
