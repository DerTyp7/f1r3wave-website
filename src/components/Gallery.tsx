"use client";

import React from "react";
import { ImageMeta } from "@/interfaces/image";
import styles from "@/styles/Gallery.module.scss";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Paginator from "@/components/Paginator";
import { PaginatorPosition } from "@/interfaces/paginator";
import LazyImage from "@/components/LazyImage";
import Image from "next/image";
import { ImagesResponse } from "@/interfaces/api";

export default function Gallery() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [images, setImages] = useState<ImageMeta[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [columns, setColumns] = useState<ImageMeta[][]>([[], [], [], []]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

	const imagesPerPage = 40;

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch(`/api/images?${searchParams.toString()}`);
				if (!response.ok) {
					throw new Error(
						`Network response was not ok: ${response.statusText}`
					);
				}

				const data = (await response.json()) as ImagesResponse;
				setImages(data.images);
				setCurrentPage(data.page);
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
	}, [searchParams]);

	useEffect(() => {
		const updateColumns = () => {
			let columnCount = 4;
			const width = window.innerWidth;

			if (width <= 600) {
				columnCount = 1;
			} else if (width <= 900) {
				columnCount = 2;
			} else if (width <= 1200) {
				columnCount = 3;
			}

			const startIndex = (currentPage - 1) * imagesPerPage;
			const endIndex = startIndex + imagesPerPage;
			const paginatedImages = images.slice(startIndex, endIndex);

			const newColumns: ImageMeta[][] = Array.from(
				{ length: columnCount },
				() => []
			);
			paginatedImages.forEach((image, index) => {
				newColumns[index % columnCount].push(image);
			});
			setColumns(newColumns);
		};

		updateColumns();
		window.addEventListener("resize", updateColumns);

		return () => window.removeEventListener("resize", updateColumns);
	}, [images, currentPage]);

	const totalPages = Math.ceil(images.length / imagesPerPage);

	useEffect(() => {
		const imagePath = searchParams.get("image");
		const pageFromQuery = parseInt(searchParams.get("page") || "1", 10);

		if (imagePath) {
			setFullScreenImage(`/images/${imagePath}`);
		}

		if (!isNaN(pageFromQuery) && pageFromQuery > 0) {
			setCurrentPage(pageFromQuery);
		} else {
			setCurrentPage(1);
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
		params.set("page", currentPage.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [currentPage, searchParams, router]);

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
		<>
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
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					totalPages={totalPages}
					position={PaginatorPosition.TOP}
				/>

				<div className={styles.images}>
					{!loading && images.length === 0 && <p>No images found</p>}
					{!loading &&
						columns.map((column, columnIndex) => (
							<div className={styles.imagesColumn} key={columnIndex}>
								{column.map((image) => (
									<LazyImage
										key={uuidv4()}
										src={`/images/${image.relative_path}`}
										alt={image.relative_path}
										onClick={() =>
											setFullScreenImage(`/images/${image.relative_path}`)
										}
									/>
								))}
							</div>
						))}
				</div>

				<Paginator
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
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
									(image) =>
										`/images/${image.relative_path}` === fullScreenImage
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
									(image) =>
										`/images/${image.relative_path}` === fullScreenImage
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
		</>
	);
}
