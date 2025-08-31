"use client";

import { useConfig } from "@/contexts/configExports";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";
import landingPageImage from "../../public/landing-page.jpg";

export default function HomePage() {
	const { config } = useConfig();

	return (
		<>
			<div className={styles.home}>
				<Image
					src={landingPageImage}
					alt="Background"
					fill
					priority
					placeholder="blur"
					className={styles.backgroundImage}
				/>
				<div className={styles.homeText}>
					<h1
						className={styles.homeTextHeadline}
						dangerouslySetInnerHTML={{ __html: config?.home.headline || "" }}
					></h1>
					<p
						className={styles.homeTextParagraph}
						dangerouslySetInnerHTML={{ __html: config?.home.text || "" }}
					></p>
					<Link
						href="/gallery"
						className={styles.homeButton}
						dangerouslySetInnerHTML={{ __html: config?.home.buttonText || "" }}
					></Link>
				</div>
			</div>
		</>
	);
}
