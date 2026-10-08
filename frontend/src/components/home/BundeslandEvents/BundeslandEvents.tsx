import type {
  KeyboardEvent,
  MouseEvent,
} from 'react'

import { mockEvents } from '../../../data/mockEvents'

import './BundeslandEvents.scss'

function BundeslandEvents() {
  const bundeslandEvents =
    mockEvents.slice(0, 3)

  const handleCardClick = (
    eventId: string,
  ) => {
    window.location.assign(
      `/events/${eventId}`,
    )
  }

  const handleCardKeyDown = (
    keyboardEvent: KeyboardEvent<HTMLElement>,
    eventId: string,
  ) => {
    if (
      keyboardEvent.key === 'Enter' ||
      keyboardEvent.key === ' '
    ) {
      keyboardEvent.preventDefault()
      handleCardClick(eventId)
    }
  }

  const handleRegisterClick = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()
  }

  return (
    <section className="bundesland-events">
      <div className="bundesland-events__header">
        <div className="bundesland-events__heading">
          <span
            className="bundesland-events__icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 5.5 9 3l6 2.5L20 3v15.5l-5 2.5-6-2.5L4 21V5.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M9 3v15.5M15 5.5V21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <div>
            <h2 className="bundesland-events__title">
              Events in your Bundesland
            </h2>

            <p className="bundesland-events__subtitle">
              Discover events across all of Bayern
            </p>
          </div>
        </div>

        <a
          href="/events?bundesland=Bayern"
          className="bundesland-events__view-all"
        >
          View all
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="bundesland-events__grid">
        {bundeslandEvents.map((event) => (
          <article
            key={event.id}
            className="bundesland-events__card"
            onClick={() =>
              handleCardClick(event.id)
            }
            onKeyDown={(keyboardEvent) =>
              handleCardKeyDown(
                keyboardEvent,
                event.id,
              )
            }
            role="link"
            tabIndex={0}
          >
            <div className="bundesland-events__image">
              <img
                src={event.imageUrl}
                alt=""
              />
            </div>

            <div className="bundesland-events__content">
              <span className="bundesland-events__category">
                {event.category}
              </span>

              <h3 className="bundesland-events__event-title">
                {event.title}
              </h3>

              <div className="bundesland-events__info">
                <p>
                  {event.date} · {event.startTime}
                </p>

                <p>{event.city}</p>
              </div>

              <div className="bundesland-events__footer">
                <div className="bundesland-events__participants">
                  <div className="bundesland-events__avatars">
                    <span>Y</span>
                    <span>A</span>
                    <span>O</span>
                  </div>

                  <span>
                    {event.registeredCount} going
                  </span>
                </div>

                <button
                  type="button"
                  className="bundesland-events__register"
                  onClick={
                    handleRegisterClick
                  }
                >
                  Register
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BundeslandEvents