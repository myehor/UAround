import { mockEvents } from '../../data/mockEvents'

import './ProfilePage.scss'

function ProfilePage() {
  const attendingEvents = mockEvents.slice(0, 3)

  return (
    <main className="profile-page">
      <div className="profile-page__layout">
        <aside className="profile-page__sidebar">
          <nav
            className="profile-page__navigation"
            aria-label="Profile navigation"
          >
            <a
              href="/profile"
              className="profile-page__nav-item profile-page__nav-item--active"
            >
              <span aria-hidden="true">♙</span>
              Profile
            </a>

            <a href="/my-events" className="profile-page__nav-item">
              <span aria-hidden="true">▣</span>
              My Events
            </a>

            <a href="/settings" className="profile-page__nav-item">
              <span aria-hidden="true">⚙</span>
              Settings
            </a>
          </nav>
        </aside>

        <div className="profile-page__content">
          <section className="profile-page__profile-card">
            <div className="profile-page__cover">
              <img
                src="https://picsum.photos/seed/uaround-profile-cover/1600/500"
                alt=""
              />

              <button type="button" className="profile-page__cover-button">
                <span aria-hidden="true">▣</span>
                Edit Cover Photo
              </button>
            </div>

            <div className="profile-page__profile-info">
              <div className="profile-page__avatar-wrapper">
                <div className="profile-page__avatar">Y</div>

                <button
                  type="button"
                  className="profile-page__avatar-button"
                  aria-label="Change profile photo"
                >
                  📷
                </button>
              </div>

              <div className="profile-page__identity">
                <h1>Yehor Mishchenko</h1>

                <p>
                  <span aria-hidden="true">📍</span>
                  Würzburg, Germany
                </p>
              </div>

              <button type="button" className="profile-page__edit-profile">
                <span aria-hidden="true">✎</span>
                Edit Profile
              </button>
            </div>
          </section>

          <div className="profile-page__main-grid">
            <div className="profile-page__main-column">
              <section className="profile-page__panel profile-page__about">
                <div className="profile-page__panel-heading">
                  <h2>About me</h2>

                  <button type="button" className="profile-page__small-button">
                    <span aria-hidden="true">✎</span>
                    Edit
                  </button>
                </div>

                <p className="profile-page__about-text">
                  Hi! I’m Yehor, originally from Ukraine and currently living
                  in Würzburg. I enjoy sports, meeting new people, and
                  exploring the city. I love football, hiking, and good
                  conversations. Always open to new activities and interesting
                  people! ⚽ 🌄
                </p>

                <div className="profile-page__about-meta">
                  <span>
                    <strong aria-hidden="true">📍</strong>
                    Würzburg, Germany
                  </span>

                  <span>
                    <strong aria-hidden="true">文</strong>
                    Ukrainian, Russian, English
                  </span>

                  <span>
                    <strong aria-hidden="true">▣</strong>
                    Joined UAround: Sep 2026
                  </span>
                </div>
              </section>

              <section className="profile-page__panel">
                <div className="profile-page__panel-heading">
                  <h2>My Events</h2>

                  <a href="/my-events" className="profile-page__view-all">
                    View all
                    <span aria-hidden="true">→</span>
                  </a>
                </div>

                <div className="profile-page__tabs">
                  <button
                    type="button"
                    className="profile-page__tab profile-page__tab--active"
                  >
                    Attending
                  </button>

                  <button type="button" className="profile-page__tab">
                    Organizing
                  </button>
                </div>

                <div className="profile-page__event-grid">
                  {attendingEvents.map((event) => (
                    <a
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="profile-page__event-card"
                    >
                      <div className="profile-page__event-image">
                        <img src={event.imageUrl} alt="" />
                      </div>

                      <div className="profile-page__event-content">
                        <span className="profile-page__event-category">
                          {event.category}
                        </span>

                        <h3>{event.title}</h3>

                        <p>
                          <span aria-hidden="true">▣</span>
                          {event.date} · {event.startTime}
                        </p>

                        <p>
                          <span aria-hidden="true">📍</span>
                          {event.venue}
                        </p>

                        <div className="profile-page__event-footer">
                          <div className="profile-page__event-avatars">
                            <span>Y</span>
                            <span>A</span>
                            <span>O</span>
                            <span>M</span>
                          </div>

                          <span>{event.registeredCount} going</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            <aside className="profile-page__right-column">
              <section className="profile-page__panel">
                <div className="profile-page__panel-heading">
                  <h2>Account</h2>

                  <button type="button" className="profile-page__small-button">
                    <span aria-hidden="true">✎</span>
                    Edit
                  </button>
                </div>

                <div className="profile-page__account-list">
                  <div>
                    <span aria-hidden="true">✉</span>
                    <p>yehor.mishchenko@example.com</p>
                  </div>

                  <div>
                    <span aria-hidden="true">☎</span>
                    <p>+49 152 12345678</p>
                  </div>

                  <button type="button">
                    <span aria-hidden="true">▣</span>
                    <p>Password</p>
                    <strong aria-hidden="true">›</strong>
                  </button>
                </div>
              </section>

              <section className="profile-page__panel">
                <div className="profile-page__panel-heading">
                  <h2>Preferences</h2>

                  <button type="button" className="profile-page__small-button">
                    <span aria-hidden="true">✎</span>
                    Edit
                  </button>
                </div>

                <div className="profile-page__preferences">
                  <button type="button">
                    <span aria-hidden="true">📍</span>

                    <span>
                      <strong>Location</strong>
                      <small>Würzburg (Germany)</small>
                    </span>

                    <b aria-hidden="true">›</b>
                  </button>

                  <button type="button">
                    <span aria-hidden="true">◎</span>

                    <span>
                      <strong>Language</strong>
                      <small>English</small>
                    </span>

                    <b aria-hidden="true">›</b>
                  </button>
                </div>
              </section>

              <section className="profile-page__danger">
                <h2>Danger zone</h2>

                <button type="button">
                  <span aria-hidden="true">♲</span>
                  Delete account
                </button>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage