import Gallery from "@/components/Gallery";
import { Suspense } from "react";

export default function GalleryPage() {
	return (
		<>
			<Suspense fallback={<div>Loading gallery...</div>}>
				<Gallery />
			</Suspense>
		</>
	);
}
