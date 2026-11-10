import "./EventResultsToolbar.scss";

export type EventSortOption = "soonest" | "latest" | "popular" | "newest";

type EventResultsToolbarProps = {
  eventCount: number;
  selectedSort: EventSortOption;
  onSortChange: (sort: EventSortOption) => void;
};

function EventResultsToolbar({
  eventCount,
  selectedSort,
  onSortChange,
}: EventResultsToolbarProps) {
  const eventLabel = eventCount === 1 ? "event" : "events";

  return (
    <div className="event-results-toolbar">
      <p className="event-results-toolbar__count">
        <strong>{eventCount}</strong> {eventLabel} found
      </p>

      <div className="event-results-toolbar__actions">
        <label className="event-results-toolbar__sort">
          <span>Sort by</span>

          <select
            value={selectedSort}
            onChange={(event) =>
              onSortChange(event.target.value as EventSortOption)
            }
          >
            <option value="soonest">Soonest</option>

            <option value="latest">Latest</option>

            <option value="popular">Most popular</option>

            <option value="newest">Newest</option>
          </select>
        </label>

        <div className="event-results-toolbar__view" aria-label="View mode">
          <button
            type="button"
            className="event-results-toolbar__view-button event-results-toolbar__view-button--active"
            aria-label="Grid view"
            title="Grid view"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="4"
                width="6"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <rect
                x="14"
                y="4"
                width="6"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <rect
                x="4"
                y="14"
                width="6"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <rect
                x="14"
                y="14"
                width="6"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </button>

          <button
            type="button"
            className="event-results-toolbar__view-button"
            aria-label="List view"
            title="List view"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M5 7h14M5 12h14M5 17h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventResultsToolbar;
