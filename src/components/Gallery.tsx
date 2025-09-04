"use client";

import React from "react";
import { ImageMeta } from "@/interfaces/image";
import styles from "@/styles/Gallery.module.scss";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Paginator from "@/components/Paginator";
import { PaginatorPosition } from "@/interfaces/paginator";
import Image from "next/image";
import { ImagesResponse } from "@/interfaces/api";

const HORIZONTAL_ASPECT_RATIO = 1.5;
const VERTICAL_ASPECT_RATIO = 0.8;

export default function Gallery() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [images, setImages] = useState<ImageMeta[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [tags, setTags] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [columnCount, setColumnCount] = useState(0);
	const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

	useEffect(() => {
		const updateColumnCount = () => {
			const container = document.querySelector(`.${styles.images}`);
			if (!container) return;

			const newColumnCount = window
				.getComputedStyle(container)
				.getPropertyValue("grid-template-columns")
				.split(" ").length;

			if (newColumnCount !== columnCount) {
				setColumnCount(newColumnCount);
			}
		};

		const fetchImages = async () => {
			try {
				const response = await fetch(`/api/images?${searchParams.toString()}`);
				if (!response.ok) {
					throw new Error(
						`Network response was not ok: ${response.statusText}`
					);
				}

				const data = (await response.json()) as ImagesResponse;
				setPage(data.page);
				setTotalPages(data.totalPages);
				setImages(data.images);
				updateColumnCount();
				setLoading(false);
			} catch (error) {
				console.error("Error fetching images:", error);
				setLoading(false);
			}
		};

		const fetchTags = async () => {
			try {
				const response = await fetch("/api/tags");
				if (!response.ok) {
					throw new Error(
						`Network response was not ok: ${response.statusText}`
					);
				}

				const data = await response.json();
				setTags(data);
			} catch (error) {
				console.error("Error fetching tags:", error);
			}
		};

		fetchImages();
		fetchTags();

		window.addEventListener("resize", updateColumnCount);
		return () => window.removeEventListener("resize", updateColumnCount);
	}, [searchParams]);

	useEffect(() => {
		const updateColumns = () => {
			const newImages = [...images];

			if (images.length > 0) {
				let usedColumnsInRow = 0;
				let usedRowsInColumn = 0;
				let imagePerRowCounter = 1;
				let index = 0;
				console.log("==============================", columnCount);

				for (const image of images) {
					console.log(index);
					usedColumnsInRow +=
						image.aspect_ratio > HORIZONTAL_ASPECT_RATIO ? 2 : 1;
					usedRowsInColumn +=
						image.aspect_ratio < VERTICAL_ASPECT_RATIO ? 2 : 1;

					if (usedColumnsInRow > columnCount) {
						const nextViableImage: ImageMeta | undefined = newImages
							.slice(index)
							.find((img) => {
								const imgAspectRatio = img.aspect_ratio;
								return (
									imgAspectRatio <= HORIZONTAL_ASPECT_RATIO &&
									image.aspect_ratio >= VERTICAL_ASPECT_RATIO
								);
							});

						if (nextViableImage) {
							console.log("Found next viable image:", nextViableImage);
							newImages.splice(index, 1);
							newImages.splice(index - 1, 0, nextViableImage);
							console.log("Updated image positions:", newImages);

							usedColumnsInRow -=
								nextViableImage.aspect_ratio > HORIZONTAL_ASPECT_RATIO ? 2 : 1;
							usedRowsInColumn -=
								nextViableImage.aspect_ratio < VERTICAL_ASPECT_RATIO ? 2 : 1;
						}
					} else if (usedColumnsInRow === columnCount) {
						usedColumnsInRow = usedRowsInColumn;
						usedRowsInColumn = 0;
					}

					imagePerRowCounter++;
					index++;
				}

				setImages(newImages);
			}
		};

		updateColumns();
	}, [columnCount]);

	useEffect(() => {
		const imagePath = searchParams.get("image");
		const pageFromQuery = parseInt(searchParams.get("page") || "1", 10);

		if (imagePath) {
			setFullScreenImage(`/images/${imagePath}`);
		}

		if (!isNaN(pageFromQuery) && pageFromQuery > 0) {
			setPage(pageFromQuery);
		} else {
			setPage(1);
		}
	}, [searchParams]);

	useEffect(() => {
		if (fullScreenImage) {
			const params = new URLSearchParams(searchParams.toString());
			const relativePath = fullScreenImage.replace("/images/", "");
			params.set("image", relativePath);
			router.replace(`?${params.toString()}`, { scroll: false });

			document.body.style.overflow = "hidden";
		} else {
			const params = new URLSearchParams(searchParams.toString());
			params.delete("image");
			router.replace(`?${params.toString()}`, { scroll: false });

			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [fullScreenImage, searchParams, router]);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [page, searchParams, router]);

	const updateQueryParams = (newParams: Record<string, string>) => {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(newParams).forEach(([key, value]) => {
			params.set(key, value);
		});
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const removeQueryParam = (key: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete(key);
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	return (
		<div className={styles.gallery}>
			<div className={styles.tags}>
				<span
					key="all"
					className={`${styles.tagsTag} ${
						!searchParams.get("tag") ? styles.tagsTagActive : ""
					}`}
					onClick={() => removeQueryParam("tag")}
				>
					All
				</span>
				{tags.map((tag, index) => {
					const activeTag = searchParams.get("tag");

					return (
						<span
							key={index}
							className={`${styles.tagsTag} ${
								activeTag === tag ? styles.tagsTagActive : ""
							}`}
							onClick={() => updateQueryParams({ tag })}
						>
							{tag}
						</span>
					);
				})}
			</div>

			<Paginator
				page={page}
				setPage={setPage}
				totalPages={totalPages}
				position={PaginatorPosition.TOP}
			/>

			<div className={styles.images}>
				{!loading && images.length === 0 && <p>No images found</p>}
				{!loading &&
					images.map((image: ImageMeta) => (
						<div
							key={uuidv4()}
							className={`${styles.imagesContainer} ${
								image.aspect_ratio > HORIZONTAL_ASPECT_RATIO
									? styles.horizontal
									: image.aspect_ratio < VERTICAL_ASPECT_RATIO
									? styles.vertical
									: ""
							}`}
						>
							<Image
								width={
									image.aspect_ratio > HORIZONTAL_ASPECT_RATIO
										? image.width
										: 350
								}
								height={
									image.aspect_ratio < VERTICAL_ASPECT_RATIO
										? image.height
										: 350
								}
								loading="lazy"
								src={`/images/${image.relative_path}`}
								alt={image.aspect_ratio?.toString()}
								onClick={() =>
									setFullScreenImage(`/images/${image.relative_path}`)
								}
							/>
						</div>
					))}
			</div>

			<Paginator
				page={page}
				setPage={setPage}
				totalPages={totalPages}
				position={PaginatorPosition.BOTTOM}
			/>

			{fullScreenImage && (
				<div
					className={styles.fullscreenModal}
					onClick={() => setFullScreenImage(null)}
				>
					<Image
						src={fullScreenImage}
						alt="Full Screen"
						fill
						style={{ objectFit: "contain" }}
						onClick={(e) => e.stopPropagation()}
					/>
					<button
						className={styles.closeButton}
						onClick={(e) => {
							e.stopPropagation();
							setFullScreenImage(null);
						}}
					>
						&times;
					</button>

					<button
						className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
						onClick={(e) => {
							e.stopPropagation();
							const currentIndex = images.findIndex(
								(image) => `/images/${image.relative_path}` === fullScreenImage
							);
							if (currentIndex > 0) {
								setFullScreenImage(
									`/images/${images[currentIndex - 1].relative_path}`
								);
							}
						}}
					>
						&#8249;
					</button>

					<button
						className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
						onClick={(e) => {
							e.stopPropagation();
							const currentIndex = images.findIndex(
								(image) => `/images/${image.relative_path}` === fullScreenImage
							);
							if (currentIndex < images.length - 1) {
								setFullScreenImage(
									`/images/${images[currentIndex + 1].relative_path}`
								);
							}
						}}
					>
						&#8250;
					</button>
				</div>
			)}
		</div>
	);
}
