import "@/styles/Paginator.scss";
import { PaginatorPosition } from "@/interfaces/paginator";

export default function Paginator({
  currentPage,
  setCurrentPage,
  totalPages,
  position,
}: {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  position?: PaginatorPosition | undefined;
}) {
  return totalPages > 1 ? (
    <div
      className={`paginator ${
        position === PaginatorPosition.TOP ? "paginator--top" : position === PaginatorPosition.BOTTOM ? "paginator--bottom" : ""
      }`}
    >
      <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
          {index + 1}
        </button>
      ))}

      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
        Next
      </button>
    </div>
  ) : (
    ""
  );
}
