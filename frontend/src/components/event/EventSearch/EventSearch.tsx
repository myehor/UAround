import { useState } from 'react'

import './EventSearch.scss'

type EventSearchProps = {
  onSearch: (query: string) => void
}

function EventSearch({
  onSearch,
}: EventSearchProps) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    onSearch(query.trim())
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="event-search">
      <div className="event-search__field">
        <span
          className="event-search__icon"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="11"
              cy="11"
              r="6.5"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="m16 16 4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Search events (e.g. yoga, language exchange, football...)"
          aria-label="Search events"
        />
      </div>

      <button
        type="button"
        className="event-search__button"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  )
}

export default EventSearch