type EventPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

import "./EventPagination.scss";

function EventPagination({
  currentPage,
  totalPages,
  onPageChange,
}: EventPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="event-pagination" aria-label="Events pagination">
      <button
        type="button"
        className="event-pagination__arrow"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`event-pagination__page ${
            page === currentPage ? "event-pagination__page--active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="event-pagination__arrow"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
}

export default EventPagination;
