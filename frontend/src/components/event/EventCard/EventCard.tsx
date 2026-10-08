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

  return (
    <article
      className={[
        'event-card',
        isFeatured && 'event-card--featured',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="event-card__image">
        <img src={event.imageUrl} alt="" />
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
          >
            Register
          </button>
        </div>
      </div>
    </article>
  )
}

export default EventCard