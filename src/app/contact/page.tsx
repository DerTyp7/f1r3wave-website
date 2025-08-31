"use client";

import { useConfig } from "@/contexts/configExports";
import styles from "./styles.module.scss";
import { useState } from "react";
import Image from "next/image";

export default function Contact() {
	const { config } = useConfig();
	/**
	 * @description The url of the link element which is currently hovered. Using url as unique identifier.
	 */
	const [currentHoverUrl, setCurrentHoverUrl] = useState<string>("");

	return (
		<>
			<div className={styles.contact}>
				<h1 className={styles.contactTitle}>{config?.contact.headline}</h1>
				<div className={styles.contactLinks}>
					{config?.contact?.links?.map((link) => (
						<a
							key={link.url}
							className={styles.contactLinksLink}
							href={link.url}
							onMouseEnter={() => setCurrentHoverUrl(link.url)}
							onMouseLeave={() => setCurrentHoverUrl("")}
							style={
								currentHoverUrl === link.url
									? {
											backgroundColor: link.hoverColor,
									  }
									: {}
							}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								className={styles.contactLinksLinkImage}
								src={link.image.src}
								alt={link.image.alt}
								width={90} // Approximate size based on your original dimensions
								height={90}
							/>
						</a>
					))}
				</div>

				{config?.contact.imprint.enable ? (
					<div className={styles.imprint}>
						<h2 className={styles.imprintHeadline}>
							{config?.contact.imprint.headline}
						</h2>
						<span>{config?.contact.imprint.name}</span>
						<span>{config?.contact.imprint.address}</span>
						<span>{config?.contact.imprint.country}</span>
						<span>{config?.contact.imprint.email}</span>
					</div>
				) : null}
			</div>
		</>
	);
}
