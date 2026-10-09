
import { useEffect, useRef, useState } from 'react'
import Splide from '@splidejs/splide'
import type { Options } from '@splidejs/splide'

import { getEvents } from '../../../api/events'
import type { Event } from '../../../types/event'

import EventCard from '../EventCard/EventCard'

import '@splidejs/splide/css'
import './PopularEvents.scss'

const MAX_POPULAR_EVENTS = 5

function PopularEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const sliderRef = useRef<HTMLDivElement | null>(null)
  const splideRef = useRef<Splide | null>(null)

  useEffect(() => {
    let isActive = true

    const loadEvents = async () => {
      try {
        const data = await getEvents()

        if (isActive) {
          setEvents(data)
        }
      } catch (error) {
        console.error('Failed to load popular events:', error)
      }
    }

    void loadEvents()

    return () => {
      isActive = false
    }
  }, [])

  const popularEvents = [...events]
    .sort(
      (firstEvent, secondEvent) =>
        secondEvent.registeredCount -
        firstEvent.registeredCount,
    )
    .slice(0, MAX_POPULAR_EVENTS)

  useEffect(() => {
    if (
      !sliderRef.current ||
      popularEvents.length === 0
    ) {
      return
    }

    const options: Options = {
      type:
        popularEvents.length > 1
          ? 'loop'
          : 'slide',
      perPage: 1,
      perMove: 1,
      gap: 0,
      arrows: popularEvents.length > 1,
      pagination: popularEvents.length > 1,
      autoplay: popularEvents.length > 1,
      interval: 5000,
      pauseOnHover: true,
      pauseOnFocus: true,
      speed: 700,
    }

    const splide = new Splide(
      sliderRef.current,
      options,
    )

    splide.on('move', (newIndex) => {
      setActiveIndex(newIndex)
    })

    splide.mount()

    splideRef.current = splide

    return () => {
      splide.destroy()
      splideRef.current = null
    }
  }, [popularEvents.length])

  const goToSlide = (index: number) => {
    splideRef.current?.go(index)
  }

  if (popularEvents.length === 0) {
    return null
  }

  return (
    <section className="popular-events">
      <div className="popular-events__header">
        <div>
          <p className="popular-events__eyebrow">
            Popular Events
          </p>

          <h2 className="popular-events__title">
            Most popular events in Bayern right now
          </h2>
        </div>

        <a
          className="popular-events__view-all"
          href="/events"
        >
          View all
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div
        ref={sliderRef}
        className="splide popular-events__main-slider"
        aria-label="Popular events"
      >
        <div className="splide__track">
          <ul className="splide__list">
            {popularEvents.map((event) => (
              <li
                key={event.id}
                className="splide__slide"
              >
                <div className="popular-events__featured">
                  <EventCard
                    event={event}
                    variant="featured"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {popularEvents.length > 1 && (
        <div className="popular-events__previews">
          {popularEvents.map((event, index) => (
            <button
              key={event.id}
              type="button"
              className={[
                'popular-events__preview',
                index === activeIndex &&
                  'popular-events__preview--active',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => goToSlide(index)}
              aria-label={`Show ${event.title}`}
            >
              <div className="popular-events__preview-image">
                <img
                  src={event.imageUrl}
                  alt=""
                  onError={(imageEvent) => {
                    imageEvent.currentTarget.style.display =
                      'none'
                  }}
                />
              </div>

              <div className="popular-events__preview-content">
                <span className="popular-events__preview-category">
                  {event.category}
                </span>

                <h3>{event.title}</h3>

                <p>
                  {event.date} · {event.startTime}
                </p>

                <p>{event.city}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default PopularEvents
