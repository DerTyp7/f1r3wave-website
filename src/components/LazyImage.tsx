import { useState } from "react";
import Image from "next/image";

export default function LazyImage({
	src,
	alt,
	onClick,
}: {
	src: string;
	alt: string;
	onClick: () => void;
}) {
	const [loaded, setLoaded] = useState(false);

	return (
		<Image
			className={`lazy-image ${
				loaded ? "lazy-image--loaded" : "lazy-image--loading"
			}`}
			src={src}
			alt={alt}
			width={300}
			height={200}
			onLoad={() => setLoaded(true)}
			onClick={onClick}
		/>
	);
}
