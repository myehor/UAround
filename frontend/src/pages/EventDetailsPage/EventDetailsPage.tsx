import { useEffect, useMemo, useState } from 'react'

import {
  getEvents,
  registerForEvent,
  cancelEventRegistration,
  getEventRegistrationStatus,
  getEventParticipants,
  deleteEvent,
  type EventParticipant,
} from '../../api/events'
import type { Event } from '../../types/event'
import { useAuth } from '../../context/useAuth'

import './EventDetailsPage.scss'

type EventDetailsPageProps = {
  eventId: string
}

function EventDetailsPage({ eventId }: EventDetailsPageProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [participants, setParticipants] = useState<EventParticipant[]>([])
  const { user } = useAuth()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const loadEvents = async () => {
      try {
        setError(null)

        const data = await getEvents()

        if (isActive) {
          setEvents(data)
        }
      } catch {
        if (isActive) {
          setError('Failed to load event details. Please try again later.')
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

    useEffect(() => {
    let isActive = true

    const loadRegistrationStatus = async () => {
      setIsRegistered(false)
      setRegistrationError(null)

      if (!user || !eventId) {
        return
      }

      try {
        const result = await getEventRegistrationStatus(eventId)

        if (isActive) {
          setIsRegistered(result.isRegistered)
        }
      } catch (error) {
        if (isActive) {
          setRegistrationError(
            error instanceof Error
              ? error.message
              : 'Failed to load registration status.',
          )
        }
      }
    }

    void loadRegistrationStatus()

    return () => {
      isActive = false
    }
  }, [eventId, user])

  const event = useMemo(
    () => events.find((item) => item.id === eventId),
    [events, eventId],
  )
  
  useEffect(() => {
    let isActive = true

    const loadParticipants = async () => {
      try {
        const data = await getEventParticipants(eventId)

        if (isActive) {
          setParticipants(data)
        }
      } catch (error) {
        console.error('Failed to load event participants:', error)
      }
    }

    void loadParticipants()

    return () => {
      isActive = false
    }
  }, [eventId])

  const [shareMessage, setShareMessage] = useState('')

  if (isLoading) {
    return (
      <main className="event-details-page">
        <div className="event-details-page__not-found">
          <p role="status">Loading event details...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="event-details-page">
        <div className="event-details-page__not-found">
          <p role="alert">{error}</p>
          <a href="/events">← Back to Events</a>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="event-details-page">
        <div className="event-details-page__not-found">
          <h1>Event not found</h1>

          <p>
            The event you are looking for does not exist or has been removed.
          </p>

          <a href="/events">← Back to Events</a>
        </div>
      </main>
    )
  }


  const isOrganizer =
    user?.id === event.creatorId || user?.id === event.createdBy?.id

  
  const handleRegistration = async () => {
    if (isOrganizer || isRegistrationLoading) {
      return
    }

    setIsRegistrationLoading(true)
    setRegistrationError(null)

    try {
      if (isRegistered) {
        await cancelEventRegistration(event.id)
        setIsRegistered(false)
      } else {
        await registerForEvent(event.id)
        setIsRegistered(true)
      }

      try {
        const updatedEvents = await getEvents()
        setEvents(updatedEvents)
      } catch {
        setRegistrationError(
          'Registration was updated, but the participant count could not be refreshed. Please reload the page.',
        )
      }
    } catch (error) {
      setRegistrationError(
        error instanceof Error
          ? error.message
          : 'Failed to update registration.',
      )
    } finally {
      setIsRegistrationLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this event? This action cannot be undone.',
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setDeleteError(null)

    try {
      await deleteEvent(event.id)
      window.location.href = '/events'
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Failed to delete event.',
      )
    } finally {
      setIsDeleting(false)
    }
  }


  const visibleParticipants = participants.slice(0, 8)

  const extraParticipants = Math.max(
    participants.length - visibleParticipants.length,
    0,
  )

  const organizerEvents = events
    .filter(
      (item) =>
        item.id !== event.id &&
        item.creatorId === event.creatorId,
    )
    .slice(0, 3)

  const similarEvents = events
    .filter(
      (item) =>
        item.id !== event.id &&
        item.category === event.category,
    )
    .slice(0, 3)

  const eventLocation = [
    event.venue,
    event.address,
    event.city,
    event.bundesland,
    'Germany',
  ]
    .filter(Boolean)
    .join(', ')

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    eventLocation,
  )}`

  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    eventLocation,
  )}&output=embed`

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    }

    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData)
        return
      } catch {
        return
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href)

      setShareMessage('Link copied!')

      window.setTimeout(() => {
        setShareMessage('')
      }, 2000)
    } catch {
      setShareMessage('Copy the link from your browser.')

      window.setTimeout(() => {
        setShareMessage('')
      }, 2500)
    }
  }

  return (
    <main className="event-details-page">
      <div className="event-details-page__container">
        <div className="event-details-page__topbar">
          <a href="/events" className="event-details-page__back">
            <span aria-hidden="true">←</span>
            Back to Events
          </a>

          <button
            type="button"
            className="event-details-page__top-share"
            onClick={handleShare}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 18 8Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M18 22a3 3 0 1 0-2.83-4A3 3 0 0 0 18 22Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m8.6 10.5 6.8-3.2M8.6 13.5l6.8 3.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            Share
          </button>

          {shareMessage && (
            <span className="event-details-page__share-message">
              {shareMessage}
            </span>
          )}
        </div>

        <div className="event-details-page__upper-grid">
          <div className="event-details-page__primary">

            <div className="event-details-page__media">
              <div className="event-details-page__hero">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                />
              </div>
            </div>

            <div className="event-details-page__heading">
              <span className="event-details-page__category">
                {event.category}
              </span>

              <h1>{event.title}</h1>

              <p>{event.description}</p>
            </div>

            <div className="event-details-page__facts">
              <div className="event-details-page__fact">
                <span className="event-details-page__fact-icon">📅</span>

                <div>
                  <strong>{event.date}</strong>
                  <span>
                    {event.startTime}
                    {event.endTime ? ` – ${event.endTime}` : ''}
                  </span>
                </div>
              </div>

              <div className="event-details-page__fact">
                <span className="event-details-page__fact-icon">📍</span>

                <div>
                  <strong>{event.city}</strong>
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className="event-details-page__fact">
                <span className="event-details-page__fact-icon">👥</span>

                <div>
                  <strong>{event.registeredCount} going</strong>
                  <span>
                    {event.participantLimit
                      ? `${event.participantLimit} spots`
                      : 'No limit'}
                  </span>
                </div>
              </div>

              <div className="event-details-page__fact">
                <span className="event-details-page__fact-icon">€</span>

                <div>
                  <strong>Free</strong>
                  <span>No fee required</span>
                </div>
              </div>
            </div>

            <section className="event-details-page__about event-details-page__panel">
              <div className="event-details-page__about-main">
                <h2>About this event</h2>

                <p>{event.description}</p>

                <p>
                  This is a great opportunity to meet new people, stay active,
                  and spend time together with the Ukrainian community.
                  Everyone is welcome, whether you are new in the city or
                  already know the local community.
                </p>

                <p>
                  Come along, enjoy the atmosphere, and make new connections
                  around a shared activity.
                </p>

                <div className="event-details-page__bring">
                  <h3>What to bring:</h3>

                  <ul>
                    <li>Comfortable clothes</li>
                    <li>Water</li>
                    <li>Good mood 🙂</li>
                  </ul>
                </div>
              </div>

              <div className="event-details-page__about-info">
                <div>
                  <span aria-hidden="true">👥</span>

                  <p>
                    <strong>Event type</strong>
                    <small>In-person</small>
                  </p>
                </div>

                <div>
                  <span aria-hidden="true">🏷️</span>

                  <p>
                    <strong>Category</strong>
                    <small>{event.category}</small>
                  </p>
                </div>

                <div>
                  <span aria-hidden="true">💬</span>

                  <p>
                    <strong>Language</strong>
                    <small>Ukrainian, English</small>
                  </p>
                </div>

                <div>
                  <span aria-hidden="true">👤</span>

                  <p>
                    <strong>Age range</strong>
                    <small>18+</small>
                  </p>
                </div>

                <div>
                  <span aria-hidden="true">🧑‍💼</span>

                  <p>
                    <strong>Organized by</strong>
                    <small>Community member</small>
                  </p>
                </div>

                <div>
                  <span aria-hidden="true">📋</span>

                  <p>
                    <strong>Contact</strong>
                    <small>Available after registration</small>
                  </p>
                </div>
              </div>
            </section>

            <section className="event-details-page__location event-details-page__panel">
              <h2>Location</h2>

              <div className="event-details-page__location-layout">
                <div className="event-details-page__map">
                  <iframe
                    title={`Map showing ${event.venue}`}
                    src={googleMapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="event-details-page__location-info">
                  <div className="event-details-page__venue-address">
                    <span aria-hidden="true">📍</span>

                    <div>
                      <strong>{event.venue}</strong>

                      <p>
                        {event.address ||
                          `${event.city}, ${event.bundesland}, Germany`}
                      </p>
                    </div>
                  </div>

                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="event-details-page__maps-button"
                  >
                    View on Google Maps
                    <span aria-hidden="true">→</span>
                  </a>

                  <div className="event-details-page__directions">
                    <h3>How to get there</h3>

                    <p>
                      <span aria-hidden="true">🚗</span>
                      By car — parking may be available nearby
                    </p>

                    <p>
                      <span aria-hidden="true">🚌</span>
                      By public transport — check local connections
                    </p>

                    <p>
                      <span aria-hidden="true">🚲</span>
                      By bike — bike parking may be available
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="event-details-page__sidebar">
            <div className="event-details-page__registration">
              {isOrganizer ? (

              <div className="event-details-page__organizer-actions">
                <div className="event-details-page__register">
                  You’re the organizer of this event.
                </div>

                <button
                  type="button"
                  className="event-details-page__delete-event"
                  onClick={handleDeleteEvent}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete event'}
                </button>

                {deleteError && (
                  <p role="alert">{deleteError}</p>
                )}
              </div>
              ) : (
                <>
                  {!isRegistered && (
                    <button
                      type="button"
                      className="event-details-page__register"
                      onClick={handleRegistration}
                      disabled={isRegistrationLoading}
                    >
                      {isRegistrationLoading ? 'Please wait...' : 'Register for this event'}
                    </button>
                  )}

                  {isRegistered && (
                    <div className="event-details-page__registration-success">
                      <h3>You’re on the list!</h3>
                      <p className="event-details-page__registration-subtitle">
                        Your registration is confirmed.
                      </p>
                      <p className="event-details-page__registration-thanks" role="status">
                        Thanks for joining us! We look forward to seeing you at the event.
                      </p>
                      <p className="event-details-page__registration-hint">
                        Plans changed? You can cancel your registration below so someone
                        else can take your spot.
                      </p>

                      <button
                        type="button"
                        className="event-details-page__cancel-registration"
                        onClick={handleRegistration}
                        disabled={isRegistrationLoading}
                      >
                        {isRegistrationLoading ? 'Cancelling...' : 'Cancel registration'}
                      </button>
                    </div>
                  )}

                  {registrationError && (
                    <p role="alert">{registrationError}</p>
                  )}
                </>
              )}
            </div>

            <div className="event-details-page__organizer-card">
              <h2>Organizer</h2>


            <div className="event-details-page__organizer-profile">
              <div className="event-details-page__organizer-avatar">
                {event.createdBy?.avatarUrl ? (
                  <img
                    src={event.createdBy.avatarUrl}
                    alt={`${event.createdBy.firstName} ${event.createdBy.lastName}`.trim()}
                  />
                ) : (
                  <span>
                    {event.createdBy
                      ? `${event.createdBy.firstName.charAt(0)}${event.createdBy.lastName.charAt(0)}`.toUpperCase()
                      : '?'}
                  </span>
                )}
              </div>

              <div>
                <strong>
                  {event.createdBy
                    ? `${event.createdBy.firstName} ${event.createdBy.lastName}`.trim()
                    : 'Unknown organizer'}
                </strong>
                <span>Community member</span>
              </div>
            </div>


              <button
                type="button"
                className="event-details-page__organizer-profile-button"
              >
                View profile
              </button>

              {organizerEvents.length > 0 ? (
                <div className="event-details-page__organizer-events">
                  <div className="event-details-page__organizer-events-heading">
                    <h3>Other events by this organizer</h3>

                    <a href="/events">View all →</a>
                  </div>

                  {organizerEvents.map((organizerEvent) => (
                    <a
                      key={organizerEvent.id}
                      href={`/events/${organizerEvent.id}`}
                      className="event-details-page__organizer-event"
                    >
                      <img
                        src={organizerEvent.imageUrl}
                        alt=""
                      />

                      <div>
                        <strong>{organizerEvent.title}</strong>

                        <span>
                          {organizerEvent.date} · {organizerEvent.city}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="event-details-page__organizer-events">
                  <div className="event-details-page__organizer-events-heading">
                    <h3>Other events by this organizer</h3>
                  </div>

                  <p className="event-details-page__empty-events">
                    This organizer hasn't created any other events yet.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="event-details-page__participants-panel">
          <div className="event-details-page__participants-heading">
            <div>
              <h2>
                Participants
                <span>({event.registeredCount})</span>
              </h2>

              <button type="button">
                View all <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="event-details-page__participants-row">
            {visibleParticipants.map((participant) => {
              const fullName =
                `${participant.firstName} ${participant.lastName}`.trim()

              return (
                <div
                  key={participant.id}
                  className="event-details-page__participant-avatar"
                  title={fullName}
                >
                  {participant.avatarUrl ? (
                    <img src={participant.avatarUrl} alt={fullName} />
                  ) : (
                    `${participant.firstName.charAt(0)}${participant.lastName.charAt(0)}`.toUpperCase()
                  )}
                </div>
              )
            })}

            {extraParticipants > 0 && (
              <div className="event-details-page__participants-more">
                +{extraParticipants}
              </div>
            )}
          </div>
        </section>

        <section className="event-details-page__similar">
          <div className="event-details-page__similar-heading">
            <h2>Similar events</h2>

            <a href="/events">View all →</a>
          </div>

          {similarEvents.length > 0 ? (
            <div className="event-details-page__similar-grid">
              {similarEvents.map((similarEvent) => (
                <article
                  key={similarEvent.id}
                  className="event-details-page__similar-card"
                  onClick={() => {
                    window.location.href = `/events/${similarEvent.id}`
                  }}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(keyboardEvent) => {
                    if (
                      keyboardEvent.key === 'Enter' ||
                      keyboardEvent.key === ' '
                    ) {
                      keyboardEvent.preventDefault()
                      window.location.href = `/events/${similarEvent.id}`
                    }
                  }}
                >
                  <div className="event-details-page__similar-image">
                    <img src={similarEvent.imageUrl} alt="" />
                  </div>

                  <div className="event-details-page__similar-content">
                    <span className="event-details-page__similar-category">
                      {similarEvent.category}
                    </span>

                    <h3>{similarEvent.title}</h3>

                    <div className="event-details-page__similar-meta">
                      <span>
                        📅 {similarEvent.date} · {similarEvent.startTime}
                      </span>

                      <span>📍 {similarEvent.city}</span>
                    </div>

                    <div className="event-details-page__similar-footer">
                      <div className="event-details-page__similar-going">
                        <div>
                          <span>Y</span>
                          <span>A</span>
                          <span>O</span>
                        </div>

                        <small>{similarEvent.registeredCount} going</small>
                      </div>

                      <button
                        type="button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation()
                        }}
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="event-details-page__empty-events">
              No similar events found.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default EventDetailsPage