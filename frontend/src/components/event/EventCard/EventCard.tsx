import { useEffect, useState, type KeyboardEvent } from "react";

import {
  cancelEventRegistration,
  getEventRegistrationStatus,
  registerForEvent,
} from "../../../api/events";
import { useAuth } from "../../../context/useAuth";
import type { Event } from "../../../types/event";

import "./EventCard.scss";

type EventCardProps = {
  event: Event;
  variant?: "default" | "featured";
};

function EventCard({ event, variant = "default" }: EventCardProps) {
  const { user } = useAuth();
  const isFeatured = variant === "featured";
  const isOrganizer =
    user?.id === event.creatorId || user?.id === event.createdBy?.id;

  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(
    event.registeredCount ?? 0,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    if (!user || isOrganizer) {
      return () => {
        isActive = false;
      };
    }

    const loadStatus = async () => {
      try {
        const result = await getEventRegistrationStatus(event.id);

        if (isActive) {
          setIsRegistered(result.isRegistered);
        }
      } catch {
        if (isActive) {
          setError("Could not check registration status.");
        }
      }
    };

    void loadStatus();

    return () => {
      isActive = false;
    };
  }, [
    event.id,
    event.registeredCount,
    event.creatorId,
    event.createdBy?.id,
    isOrganizer,
    user,
  ]);

  const handleCardClick = () => {
    window.location.href = `/events/${event.id}`;
  };

  const handleCardKeyDown = (keyboardEvent: KeyboardEvent<HTMLElement>) => {
    if (keyboardEvent.target !== keyboardEvent.currentTarget) {
      return;
    }

    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault();
      handleCardClick();
    }
  };

  const handleRegistration = async (
    clickEvent: React.MouseEvent<HTMLButtonElement>,
  ) => {
    clickEvent.stopPropagation();

    if (isLoading || isOrganizer) {
      return;
    }

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isRegistered) {
        await cancelEventRegistration(event.id);
        setIsRegistered(false);
        setRegisteredCount((count) => Math.max(0, count - 1));
      } else {
        await registerForEvent(event.id);
        setIsRegistered(true);
        setRegisteredCount((count) => count + 1);
      }
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : "Failed to update registration.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article
      className={["event-card", isFeatured && "event-card--featured"]
        .filter(Boolean)
        .join(" ")}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className="event-card__image">
        <img src={event.imageUrl} alt="" />
      </div>

      <div className="event-card__content">
        <span className="event-card__category">{event.category}</span>

        <h3 className="event-card__title">{event.title}</h3>

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
              <span className="event-card__avatar">Y</span>
              <span className="event-card__avatar">A</span>
              <span className="event-card__avatar">O</span>
            </div>

            <span>{registeredCount} going</span>
          </div>

          <button
            type="button"
            className={[
              "event-card__register",
              isRegistered && "event-card__register--cancel",
              isOrganizer && "event-card__register--organizer",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={handleRegistration}
            disabled={isLoading || isOrganizer}
            aria-label={
              isOrganizer
                ? "You are the organizer"
                : isRegistered
                  ? "Cancel registration"
                  : "Register for event"
            }
          >
            {isOrganizer
              ? "Organizer"
              : isLoading
                ? "Please wait..."
                : isRegistered
                  ? "Cancel"
                  : "Register"}
          </button>
        </div>

        {error && (
          <p className="event-card__registration-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

export default EventCard;
