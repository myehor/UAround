import {
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { getEvents } from "../../../api/events";
import type { Event } from "../../../types/event";

import "./EventsNearYou.scss";

function EventsNearYou() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadEvents = async () => {
      try {
        const data = await getEvents();

        if (isActive) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to load nearby events:", error);
      }
    };

    void loadEvents();

    return () => {
      isActive = false;
    };
  }, []);

  const nearbyEvents = events.slice(0, 3);

  const handleCardClick = (eventId: string) => {
    window.location.assign(`/events/${eventId}`);
  };

  const handleCardKeyDown = (
    keyboardEvent: KeyboardEvent<HTMLElement>,
    eventId: string,
  ) => {
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault();
      handleCardClick(eventId);
    }
  };

  const handleRegisterClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <section className="events-near-you">
      <div className="events-near-you__header">
        <div className="events-near-you__heading">
          <span className="events-near-you__icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="12"
                cy="9"
                r="2.2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>

          <div>
            <p className="events-near-you__eyebrow">Events near you</p>

            <p className="events-near-you__subtitle">
              Events in your area · within 20 km
            </p>
          </div>
        </div>

        <a href="/events" className="events-near-you__view-all">
          View all
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="events-near-you__grid">
        {nearbyEvents.map((event) => (
          <article
            key={event.id}
            className="events-near-you__card"
            onClick={() => handleCardClick(event.id)}
            onKeyDown={(keyboardEvent) =>
              handleCardKeyDown(keyboardEvent, event.id)
            }
            role="link"
            tabIndex={0}
          >
            <div className="events-near-you__image">
              <img src={event.imageUrl} alt="" />
            </div>

            <div className="events-near-you__content">
              <span className="events-near-you__category">
                {event.category}
              </span>

              <h3 className="events-near-you__title">{event.title}</h3>

              <div className="events-near-you__info">
                <p>
                  {event.date} · {event.startTime}
                </p>

                <p>{event.city}</p>
              </div>

              <div className="events-near-you__footer">
                <div className="events-near-you__participants">
                  <div className="events-near-you__avatars">
                    <span>Y</span>
                    <span>A</span>
                    <span>O</span>
                  </div>

                  <span>{event.registeredCount} going</span>
                </div>

                <button
                  type="button"
                  className="events-near-you__register"
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EventsNearYou;
