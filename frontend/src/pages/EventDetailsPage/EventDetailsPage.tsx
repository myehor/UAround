import { useEffect, useMemo, useState } from 'react'

import { getEvents } from '../../api/events'
import type { Event } from '../../types/event'

import './EventDetailsPage.scss'

type EventDetailsPageProps = {
  eventId: string
}

function EventDetailsPage({ eventId }: EventDetailsPageProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const event = useMemo(
    () => events.find((item) => item.id === eventId),
    [events, eventId],
  )

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
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

  const galleryImages = [
    event.imageUrl,
    `https://picsum.photos/seed/uaround-${event.id}-2/800/450`,
    `https://picsum.photos/seed/uaround-${event.id}-3/800/450`,
    `https://picsum.photos/seed/uaround-${event.id}-4/800/450`,
    `https://picsum.photos/seed/uaround-${event.id}-5/800/450`,
  ]

  const spotsLeft =
    event.participantLimit !== undefined
      ? Math.max(event.participantLimit - event.registeredCount, 0)
      : undefined

  const capacityPercentage =
    event.participantLimit !== undefined
      ? Math.min(
          (event.registeredCount / event.participantLimit) * 100,
          100,
        )
      : 0

  const participantNames = [
    'Yehor',
    'Anna',
    'Oleksii',
    'Maria',
    'Dmytro',
    'Olena',
    'Andrii',
    'Kateryna',
  ]

  const visibleParticipants = participantNames.slice(
    0,
    Math.min(participantNames.length, event.registeredCount),
  )

  const extraParticipants = Math.max(
    event.registeredCount - visibleParticipants.length,
    0,
  )

  const organizerEvents = events
    .filter(
      (item) =>
        item.id !== event.id &&
        (item.city === event.city || item.bundesland === event.bundesland),
    )
    .slice(0, 3)

  const similarEvents = events
    .filter(
      (item) =>
        item.id !== event.id &&
        (item.category === event.category ||
          item.bundesland === event.bundesland),
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
                  src={galleryImages[selectedImageIndex]}
                  alt={event.title}
                />
              </div>

              <div
                className="event-details-page__gallery"
                aria-label="Event photos"
              >
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={[
                      'event-details-page__thumbnail',
                      index === selectedImageIndex
                        ? 'event-details-page__thumbnail--active'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`View event photo ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}

                <button
                  type="button"
                  className="event-details-page__more-photos"
                  aria-label="View 12 more photos"
                >
                  <span>+12</span>
                  <small>photos</small>
                </button>
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
              <button
                type="button"
                className="event-details-page__register"
              >
                <span aria-hidden="true">👥</span>
                Register for this event
              </button>

              {event.participantLimit !== undefined && (
                <div className="event-details-page__capacity">
                  <strong>
                    {event.registeredCount} of {event.participantLimit} spots
                    filled
                  </strong>

                  <div className="event-details-page__capacity-bar">
                    <div
                      className="event-details-page__capacity-progress"
                      style={{
                        width: `${capacityPercentage}%`,
                      }}
                    />
                  </div>

                  {spotsLeft !== undefined && (
                    <p>
                      {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked'}
                    </p>
                  )}
                </div>
              )}

              <div className="event-details-page__mini-participants">
                <div className="event-details-page__mini-avatars">
                  {visibleParticipants.slice(0, 5).map((name) => (
                    <span key={name}>{name.charAt(0)}</span>
                  ))}
                </div>

                {event.registeredCount > 5 && (
                  <strong>+{event.registeredCount - 5}</strong>
                )}
              </div>

              <div className="event-details-page__benefits">
                <div>
                  <span>👥</span>

                  <p>
                    <strong>Meet new people</strong>

                    <small>
                      Connect with fellow Ukrainians in your area
                    </small>
                  </p>
                </div>

                <div>
                  <span>🙌</span>

                  <p>
                    <strong>Enjoy the event</strong>

                    <small>
                      Spend time together in a friendly atmosphere
                    </small>
                  </p>
                </div>

                <div>
                  <span>🤝</span>

                  <p>
                    <strong>Build community</strong>

                    <small>Be part of the Ukrainian community</small>
                  </p>
                </div>
              </div>
            </div>

            <div className="event-details-page__organizer-card">
              <h2>Organizer</h2>

              <div className="event-details-page__organizer-profile">
                <div className="event-details-page__organizer-avatar">
                  AK
                </div>

                <div>
                  <strong>Andrii Kovalchuk</strong>
                  <span>Community member</span>
                </div>
              </div>

              <button
                type="button"
                className="event-details-page__organizer-profile-button"
              >
                View profile
              </button>

              {organizerEvents.length > 0 && (
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
            {visibleParticipants.map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="event-details-page__participant-avatar"
                title={name}
              >
                {name.charAt(0)}
              </div>
            ))}

            {extraParticipants > 0 && (
              <div className="event-details-page__participants-more">
                +{extraParticipants}
              </div>
            )}
          </div>
        </section>

        {similarEvents.length > 0 && (
          <section className="event-details-page__similar">
            <div className="event-details-page__similar-heading">
              <h2>Similar events</h2>

              <a href="/events">View all →</a>
            </div>

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
                    <img
                      src={similarEvent.imageUrl}
                      alt=""
                    />
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

                      <span>
                        📍 {similarEvent.city}
                      </span>
                    </div>

                    <div className="event-details-page__similar-footer">
                      <div className="event-details-page__similar-going">
                        <div>
                          <span>Y</span>
                          <span>A</span>
                          <span>O</span>
                        </div>

                        <small>
                          {similarEvent.registeredCount} going
                        </small>
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
          </section>
        )}
      </div>
    </main>
  )
}

export default EventDetailsPage