"use client";

import styles from "@/styles/Paginator.module.scss";
import { PaginatorPosition } from "@/interfaces/paginator";

interface PaginatorProps {
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
	position?: PaginatorPosition | undefined;
}

export default function Paginator({
	page,
	setPage,
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
			<button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
				Previous
			</button>

			{Array.from({ length: totalPages }, (_, index) => (
				<button
					key={index + 1}
					className={page === index + 1 ? styles.active : ""}
					onClick={() => setPage(index + 1)}
				>
					{index + 1}
				</button>
			))}

			<button
				disabled={page === totalPages}
				onClick={() => setPage((prev) => prev + 1)}
			>
				Next
			</button>
		</div>
	);
}
