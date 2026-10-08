import type { KeyboardEvent } from 'react'

import type { Event } from '../../../types/event'

import './EventCard.scss'

type EventCardProps = {
  event: Event
  variant?: 'default' | 'featured'
}

function EventCard({
  event,
  variant = 'default',
}: EventCardProps) {
  const isFeatured = variant === 'featured'

  const handleCardClick = () => {
    window.location.href = `/events/${event.id}`
  }

  const handleCardKeyDown = (
    keyboardEvent: KeyboardEvent<HTMLElement>,
  ) => {
    if (
      keyboardEvent.key === 'Enter' ||
      keyboardEvent.key === ' '
    ) {
      keyboardEvent.preventDefault()
      handleCardClick()
    }
  }

  return (
    <article
      className={[
        'event-card',
        isFeatured && 'event-card--featured',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className="event-card__image">
        <img
          src={event.imageUrl}
          alt=""
        />
      </div>

      <div className="event-card__content">
        <span className="event-card__category">
          {event.category}
        </span>

        <h3 className="event-card__title">
          {event.title}
        </h3>

        <div className="event-card__info">
          <p>
            {event.date} · {event.startTime}
          </p>

          <p>
            {event.city} · {event.venue}
          </p>
        </div>

        <div className="event-card__footer">
          <div className="event-card__participants">
            <div className="event-card__avatars">
              <span className="event-card__avatar">
                Y
              </span>

              <span className="event-card__avatar">
                A
              </span>

              <span className="event-card__avatar">
                O
              </span>
            </div>

            <span>
              {event.registeredCount} going
            </span>
          </div>

          <button
            type="button"
            className="event-card__register"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            Register
          </button>
        </div>
      </div>
    </article>
  )
}

export default EventCard