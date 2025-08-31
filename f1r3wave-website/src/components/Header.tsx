"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo_text.png";
import styles from "@/styles/Header.module.scss";

export default function Header() {
	const pathname = usePathname();
	const isActive = (path: string) => pathname === path;

	return (
		<header className={styles.header}>
			<Link href="/">
				<Image
					className={styles.headerLogo}
					src={logo}
					alt="Logo F1r3wave"
					priority
				/>
			</Link>
			<nav className={styles.headerNav}>
				<Link
					href="/"
					className={`${styles.headerNavLink} ${
						isActive("/") ? styles.headerNavLinkActive : ""
					}`}
				>
					Home
				</Link>
				<Link
					href="/gallery"
					className={`${styles.headerNavLink} ${
						isActive("/gallery") ? styles.headerNavLinkActive : ""
					}`}
				>
					Gallery
				</Link>
				<Link
					href="/contact"
					className={`${styles.headerNavLink} ${
						isActive("/contact") ? styles.headerNavLinkActive : ""
					}`}
				>
					Contact
				</Link>
			</nav>
		</header>
	);
}
