import { useEffect, useRef, useState } from 'react'

import Container from '../../components/layout/Container/Container'
import EventCard from '../../components/event/EventCard/EventCard'
import EventFilters from '../../components/event/EventFilters/EventFilters'
import EventPagination from '../../components/event/EventPagination/EventPagination'
import EventResultsToolbar, {
  type EventSortOption,
} from '../../components/event/EventResultsToolbar/EventResultsToolbar'
import EventSearch from '../../components/event/EventSearch/EventSearch'
import { getEvents } from '../../api/events'
import type { Event } from '../../types/event'
import type { EventCategory } from '../../types/event'
import heroImage from '../../assets/images/hero-city.png'

import './EventsPage.scss'

const EVENTS_PER_PAGE = 12

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const loadEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getEvents()

        if (isActive) {
          setEvents(data)
        }
      } catch {
        if (isActive) {
          setError(
            'Failed to load events. Please try again later.',
          )
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadEvents()

    return () => {
      isActive = false
    }
  }, [])

  const [searchQuery, setSearchQuery] =
    useState('')

  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | ''>('')

  const [
    selectedBundesland,
    setSelectedBundesland,
  ] = useState('')

  const [selectedCity, setSelectedCity] =
    useState('')

  const [selectedDateFrom, setSelectedDateFrom] =
    useState('')

  const [selectedDateTo, setSelectedDateTo] =
    useState('')

  const [selectedSort, setSelectedSort] =
    useState<EventSortOption>('soonest')

  const [currentPage, setCurrentPage] =
    useState(1)

  const resultsRef = useRef<HTMLDivElement>(null)

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedBundesland('')
    setSelectedCity('')
    setSelectedDateFrom('')
    setSelectedDateTo('')
    setSelectedSort('soonest')
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const filteredEvents = events.filter(
    (event) => {
      const query =
        searchQuery.toLowerCase()

      const matchesSearch =
        !query ||
        [
          event.title,
          event.description,
          event.category,
          event.city,
          event.venue,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(query),
        )

      const matchesCategory =
        !selectedCategory ||
        event.category === selectedCategory

      const matchesBundesland =
        !selectedBundesland ||
        event.bundesland ===
          selectedBundesland

      const matchesCity =
        !selectedCity ||
        event.city === selectedCity

      const matchesDateFrom =
        !selectedDateFrom ||
        event.date >= selectedDateFrom

      const matchesDateTo =
        !selectedDateTo ||
        event.date <= selectedDateTo

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBundesland &&
        matchesCity &&
        matchesDateFrom &&
        matchesDateTo
      )
    },
  )

  const sortedEvents = [
    ...filteredEvents,
  ].sort((firstEvent, secondEvent) => {
    if (selectedSort === 'soonest') {
      return firstEvent.date.localeCompare(
        secondEvent.date,
      )
    }

    if (selectedSort === 'latest') {
      return secondEvent.date.localeCompare(
        firstEvent.date,
      )
    }

    if (selectedSort === 'popular') {
      return (
        secondEvent.registeredCount -
        firstEvent.registeredCount
      )
    }

    if (selectedSort === 'newest') {
      return secondEvent.createdAt.localeCompare(
        firstEvent.createdAt,
      )
    }

    return 0
  })

  const totalPages = Math.ceil(
    sortedEvents.length /
      EVENTS_PER_PAGE,
  )

  const startIndex =
    (currentPage - 1) *
    EVENTS_PER_PAGE

  const paginatedEvents =
    sortedEvents.slice(
      startIndex,
      startIndex + EVENTS_PER_PAGE,
    )

  return (
    <div className="events-page">
      <section className="events-page__hero">
        <Container>
          <div
            className="events-page__hero-image"
            style={{
              backgroundImage: `url(${heroImage})`,
            }}
          >
            <div className="events-page__hero-overlay" />

            <div className="events-page__hero-content">
              <h1>
                All Ukrainian events
              </h1>

              <p>
                Find events, meet people, and be
                part
                <br />
                of the community across Germany.
              </p>
            </div>

            <div className="events-page__community">
              <div className="events-page__community-icon">
                <span aria-hidden="true">
                  ♟
                </span>
              </div>

              <div>
                <p className="events-page__community-title">
                  Ukrainian community
                  <br />
                  in Germany
                </p>

                <p className="events-page__community-count">
                  2,500+ members
                  <span aria-hidden="true">
                    ›
                  </span>
                </p>
              </div>
            </div>
          </div>

          <EventSearch
            onSearch={(query) => {
              setSearchQuery(query)
              setCurrentPage(1)
            }}
          />

          <div className="events-page__content">
            <EventFilters
              selectedCategory={
                selectedCategory
              }
              onCategoryChange={(category) => {
                setSelectedCategory(category)
                setCurrentPage(1)
              }}
              selectedBundesland={
                selectedBundesland
              }
              selectedCity={
                selectedCity
              }
              selectedDateFrom={
                selectedDateFrom
              }
              selectedDateTo={
                selectedDateTo
              }
              onBundeslandChange={(bundesland) => {
                setSelectedBundesland(
                  bundesland,
                )
                setCurrentPage(1)
              }}
              onCityChange={(city) => {
                setSelectedCity(city)
                setCurrentPage(1)
              }}
              onDateFromChange={(date) => {
                setSelectedDateFrom(date)
                setCurrentPage(1)
              }}
              onDateToChange={(date) => {
                setSelectedDateTo(date)
                setCurrentPage(1)
              }}
              onReset={
                handleResetFilters
              }
            />

            <div
              className="events-page__results"
              ref={resultsRef}
            >
              <EventResultsToolbar
                eventCount={
                  filteredEvents.length
                }
                selectedSort={selectedSort}
                onSortChange={(sort) => {
                  setSelectedSort(sort)
                  setCurrentPage(1)
                }}
              />

              {isLoading ? (
                <p role="status">Loading events...</p>
              ) : error ? (
                <p role="alert">{error}</p>
              ) : (
                <div className="events-page__grid">
                  {paginatedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <EventPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={
                    handlePageChange
                  }
                />
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default EventsPage