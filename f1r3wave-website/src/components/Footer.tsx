import styles from "@/styles/Footer.module.scss";
import Link from "next/link";

interface FooterProps {
	isInLandingPage?: boolean;
}

export default function Footer({ isInLandingPage }: FooterProps) {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={`${styles.footer} ${
				isInLandingPage ? styles.footerLandingPage : ""
			}`}
		>
			<Link
				href="https://github.com/DerTyp7/f1r3wave-website"
				className={styles.footerGithub}
				target="_blank"
				rel="noopener noreferrer"
			>
				View Source Code on GitHub
			</Link>
			<span>&#169; {currentYear} Janis Meister. All rights reserved.</span>
		</footer>
	);
}
