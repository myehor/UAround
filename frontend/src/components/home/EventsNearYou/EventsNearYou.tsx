import { mockEvents } from '../../../data/mockEvents'
import './EventsNearYou.scss'

function EventsNearYou() {
  const nearbyEvents = mockEvents.slice(0, 3)

  return (
    <section className="events-near-you">
      <div className="events-near-you__header">
        <div>
          <p className="events-near-you__eyebrow">
            Events near you
          </p>

          <p className="events-near-you__subtitle">
            Events in your area · within 20 km
          </p>
        </div>

        <a
          href="/events"
          className="events-near-you__view-all"
        >
          View all
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="events-near-you__grid">
        {nearbyEvents.map((event) => (
          <article
            key={event.id}
            className="events-near-you__card"
          >
            <div className="events-near-you__image">
              <img
                src={event.imageUrl}
                alt=""
              />
            </div>

            <div className="events-near-you__content">
              <span className="events-near-you__category">
                {event.category}
              </span>

              <h3 className="events-near-you__title">
                {event.title}
              </h3>

              <div className="events-near-you__info">
                <p>
                  {event.date} · {event.startTime}
                </p>

                <p>
                  {event.city}
                </p>
              </div>

              <div className="events-near-you__footer">
                <div className="events-near-you__participants">
                  <div className="events-near-you__avatars">
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
                  className="events-near-you__register"
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

export default EventsNearYou