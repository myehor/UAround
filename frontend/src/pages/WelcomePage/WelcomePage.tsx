import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import './WelcomePage.scss'

function WelcomePage() {
  const { logout } = useAuth()
  const [showIntro, setShowIntro] = useState(true)
  const [introLeaving, setIntroLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => {
      setIntroLeaving(true)
    }, 5200)

    const hideTimer = window.setTimeout(() => {
      setShowIntro(false)
    }, 6000)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  return (
    <main className="welcome-page">
      {showIntro && (
        <div
          className={`welcome-intro ${
            introLeaving ? 'welcome-intro--leaving' : ''
          }`}
          aria-label="Welcome to UAround"
        >
          <div className="welcome-intro__orbits">
            <span />
            <span />
            <span />
          </div>

          <div className="welcome-intro__content">
            <img
              src="/images/uaround-logo.png"
              alt="UAround"
            />

            <h1>Welcome to UAround</h1>
            <p>Your community. Your events.</p>

            <div className="welcome-intro__loader">
              <span />
            </div>
          </div>
        </div>
      )}

      

      <div className="welcome-page__container">
        <header className="welcome-page__header">
          <a href="/" aria-label="UAround home">
            <img
              src="/images/uaround-logo.png"
              alt="UAround"
            />
          </a>
        </header>

        <section className="welcome-page__hero">
          <div className="welcome-page__content">
            <span className="welcome-page__eyebrow">
              YOUR COMMUNITY. YOUR EVENTS.
            </span>

            <h1>
              Find your people.
              <br />
              Discover your
              <br />
              next <span>event.</span>
            </h1>

            <p className="welcome-page__description">
              Discover Ukrainian events, meet new people
              and find your community across Germany.
            </p>

            <div className="welcome-page__actions">
              <a
                href="/login"
                className="welcome-page__button welcome-page__button--primary"
              >
                Get Started
                <span>→</span>
              </a>

              <a
                href="/home"
                className="welcome-page__button welcome-page__button--secondary"
                onClick={async (event) => {
                  event.preventDefault()

                  try {
                    await logout()
                    window.location.assign('/home')
                  } catch (error) {
                    console.error('Failed to log out:', error)
                  }
                }}
              >
                Explore as Guest
              </a>
            </div>

            <div className="welcome-page__features">
              <span>Discover events</span>
              <span>Meet people</span>
              <span>Create memories</span>
            </div>
          </div>

          <div
            className="welcome-page__visual"
            aria-label="Explore Germany: Berlin, Köln and München"
          >
            <div className="welcome-page__map-glow" />

            {/* Berlin */}
            <div className="welcome-page__city welcome-page__city--berlin">
              <div className="welcome-page__city-photo">
                <img
                  src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=400&q=85"
                  alt="Berlin"
                />
              </div>
              <span className="welcome-page__city-label">
                <span className="welcome-page__location-dot" />
                Berlin
              </span>
            </div>

            {/* Köln */}
            <div className="welcome-page__city welcome-page__city--cologne">
              <div className="welcome-page__city-photo">
                <img
                  src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=400&q=85"
                  alt="Cologne"
                />
              </div>
              <span className="welcome-page__city-label">
                <span className="welcome-page__location-dot" />
                Köln
              </span>
            </div>

            {/* München */}
            <div className="welcome-page__city welcome-page__city--munich">
              <div className="welcome-page__city-photo">
                <img
                  src="https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=400&q=85"
                  alt="Munich"
                />
              </div>
              <span className="welcome-page__city-label">
                <span className="welcome-page__location-dot" />
                München
              </span>
            </div>
          </div>

        </section>

        <footer className="welcome-page__footer">
          <span>Made for people. Connected by events.</span>
          <span>© UAround 2026</span>
        </footer>
      </div>
    </main>
  )
}

export default WelcomePage
