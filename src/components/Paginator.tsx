"use client";

import styles from "@/styles/Paginator.module.scss";
import { PaginatorPosition } from "@/interfaces/paginator";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface PaginatorProps {
  page: number;
  totalPages: number;
  position?: PaginatorPosition | undefined;
}

export default function Paginator({ page, totalPages, position }: PaginatorProps) {
  const router = useRouter();
  if (totalPages <= 1) return null;

  const setPage = (newPage: number) => {
    const pathParts = window.location.pathname.split("/");
    pathParts[pathParts.length - 1] = newPage.toString();
    const newPath = pathParts.join("/");

    router.push(newPath);
  };

  return (
    <div className={`${styles.paginator} ${position === PaginatorPosition.TOP ? styles.paginatorTop : position === PaginatorPosition.BOTTOM ? styles.paginatorBottom : ""}`}>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button key={index + 1} className={+page === index + 1 ? styles.active : ""} onClick={() => setPage(index + 1)}>
          {index + 1}
        </button>
      ))}

      <button disabled={page === totalPages} onClick={() => setPage(+page + 1)}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
}
