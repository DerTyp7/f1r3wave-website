"use client";

import styles from "@/styles/Paginator.module.scss";
import { PaginatorPosition } from "@/interfaces/paginator";

interface PaginatorProps {
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
	position?: PaginatorPosition | undefined;
}

export default function Paginator({
	currentPage,
	setCurrentPage,
	totalPages,
	position,
}: PaginatorProps) {
	if (totalPages <= 1) return null;

	return (
		<div
			className={`${styles.paginator} ${
				position === PaginatorPosition.TOP
					? styles.paginatorTop
					: position === PaginatorPosition.BOTTOM
					? styles.paginatorBottom
					: ""
			}`}
		>
			<button
				disabled={currentPage === 1}
				onClick={() => setCurrentPage((prev) => prev - 1)}
			>
				Previous
			</button>

			{Array.from({ length: totalPages }, (_, index) => (
				<button
					key={index + 1}
					className={currentPage === index + 1 ? styles.active : ""}
					onClick={() => setCurrentPage(index + 1)}
				>
					{index + 1}
				</button>
			))}

			<button
				disabled={currentPage === totalPages}
				onClick={() => setCurrentPage((prev) => prev + 1)}
			>
				Next
			</button>
		</div>
	);
}
