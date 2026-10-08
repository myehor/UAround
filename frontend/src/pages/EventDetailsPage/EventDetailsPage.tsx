import { useMemo } from 'react'

import { mockEvents } from '../../data/mockEvents'

import './EventDetailsPage.scss'

type EventDetailsPageProps = {
  eventId: string
}

function EventDetailsPage({
  eventId,
}: EventDetailsPageProps) {
  const event = useMemo(
    () =>
      mockEvents.find(
        (item) => item.id === eventId,
      ),
    [eventId],
  )

  if (!event) {
    return (
      <main className="event-details-page">
        <div className="event-details-page__not-found">
          <h1>Event not found</h1>

          <p>
            The event you are looking for
            does not exist or has been removed.
          </p>

          <a href="/events">
            ← Back to Events
          </a>
        </div>
      </main>
    )
  }

  const spotsLeft =
    event.participantLimit !== undefined
      ? Math.max(
          event.participantLimit -
            event.registeredCount,
          0,
        )
      : undefined

  return (
    <main className="event-details-page">
      <div className="event-details-page__container">
        <a
          href="/events"
          className="event-details-page__back"
        >
          <span aria-hidden="true">←</span>
          Back to Events
        </a>

        <div className="event-details-page__layout">
          <div className="event-details-page__main">
            <div className="event-details-page__hero">
              <img
                src={event.imageUrl}
                alt={event.title}
              />
            </div>

            <div className="event-details-page__heading">
              <span className="event-details-page__category">
                {event.category}
              </span>

              <h1>{event.title}</h1>

              <p className="event-details-page__description">
                {event.description}
              </p>
            </div>

            <div className="event-details-page__facts">
              <div className="event-details-page__fact">
                <span
                  className="event-details-page__fact-icon"
                  aria-hidden="true"
                >
                  📅
                </span>

                <div>
                  <strong>
                    {event.date}
                  </strong>

                  <span>
                    {event.startTime}
                    {event.endTime
                      ? ` – ${event.endTime}`
                      : ''}
                  </span>
                </div>
              </div>

              <div className="event-details-page__fact">
                <span
                  className="event-details-page__fact-icon"
                  aria-hidden="true"
                >
                  📍
                </span>

                <div>
                  <strong>
                    {event.city}
                  </strong>

                  <span>
                    {event.venue}
                  </span>
                </div>
              </div>

              <div className="event-details-page__fact">
                <span
                  className="event-details-page__fact-icon"
                  aria-hidden="true"
                >
                  👥
                </span>

                <div>
                  <strong>
                    {event.registeredCount}{' '}
                    going
                  </strong>

                  <span>
                    {event.participantLimit
                      ? `${event.participantLimit} spots`
                      : 'No limit'}
                  </span>
                </div>
              </div>

              <div className="event-details-page__fact">
                <span
                  className="event-details-page__fact-icon"
                  aria-hidden="true"
                >
                  €
                </span>

                <div>
                  <strong>Free</strong>

                  <span>
                    No fee required
                  </span>
                </div>
              </div>
            </div>

            <section className="event-details-page__section">
              <h2>About this event</h2>

              <p>
                {event.description}
              </p>

              <p>
                Join the Ukrainian community,
                meet new people, and enjoy a
                great atmosphere together.
              </p>
            </section>
          </div>

          <aside className="event-details-page__sidebar">
            <div className="event-details-page__registration">
              <button
                type="button"
                className="event-details-page__register"
              >
                <span aria-hidden="true">
                  👥
                </span>
                Register for this event
              </button>

              {event.participantLimit !==
                undefined && (
                <div className="event-details-page__capacity">
                  <div className="event-details-page__capacity-header">
                    <span>
                      {event.registeredCount}{' '}
                      of {event.participantLimit}{' '}
                      spots filled
                    </span>
                  </div>

                  <div className="event-details-page__capacity-bar">
                    <div
                      className="event-details-page__capacity-progress"
                      style={{
                        width: `${Math.min(
                          (event.registeredCount /
                            event.participantLimit) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>

                  {spotsLeft !== undefined && (
                    <p>
                      {spotsLeft > 0
                        ? `${spotsLeft} spots left`
                        : 'Fully booked'}
                    </p>
                  )}
                </div>
              )}

              <div className="event-details-page__divider" />

              <button
                type="button"
                className="event-details-page__save"
              >
                ♡ Save Event
              </button>
            </div>

            <div className="event-details-page__sidebar-card">
              <h2>Event information</h2>

              <div className="event-details-page__sidebar-item">
                <span aria-hidden="true">
                  🏷️
                </span>

                <div>
                  <strong>Category</strong>
                  <span>
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="event-details-page__sidebar-item">
                <span aria-hidden="true">
                  📍
                </span>

                <div>
                  <strong>Location</strong>
                  <span>
                    {event.city}
                  </span>
                </div>
              </div>

              <div className="event-details-page__sidebar-item">
                <span aria-hidden="true">
                  🏢
                </span>

                <div>
                  <strong>Venue</strong>
                  <span>
                    {event.venue}
                  </span>
                </div>
              </div>

              <div className="event-details-page__sidebar-item">
                <span aria-hidden="true">
                  🗺️
                </span>

                <div>
                  <strong>Bundesland</strong>
                  <span>
                    {event.bundesland}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default EventDetailsPage