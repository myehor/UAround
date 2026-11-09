
import { useEffect, useState } from 'react'
import './WelcomePage.scss'

function WelcomePage() {
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

      <div className="welcome-page__background">
        <div className="welcome-page__orb welcome-page__orb--one" />
        <div className="welcome-page__orb welcome-page__orb--two" />
        <div className="welcome-page__orbit" />
      </div>

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

            <svg
              className="welcome-page__map"
              viewBox="0 0 440 520"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="germany-fill"
                  x1="150"
                  y1="20"
                  x2="300"
                  y2="480"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#DDF3FF" />
                  <stop offset="1" stopColor="#A8DCFA" />
                </linearGradient>

                <filter
                  id="germany-shadow"
                  x="-20%"
                  y="-10%"
                  width="140%"
                  height="125%"
                >
                  <feGaussianBlur stdDeviation="10" />
                </filter>

                <path
                  id="germany-shape"
                  d={`M 354.5 90.9
C 357.2 95.6, 365.1 118.0, 365.2 122.5
C 365.3 126.9, 355.1 136.3, 355.6 139.9
C 356.2 143.5, 368.4 156.5, 370.8 161.5
C 373.3 166.5, 381.5 189.5, 382.5 194.6
C 383.4 199.6, 379.2 210.9, 380.8 216.5
C 382.4 222.1, 399.4 251.3, 399.6 255.6
C 399.7 259.9, 384.9 263.2, 382.3 263.3
C 379.7 263.4, 373.3 256.2, 371.4 256.7
C 369.6 257.2, 365.6 266.9, 362.2 269.3
C 358.7 271.7, 338.0 280.1, 334.1 282.9
C 330.3 285.6, 323.9 296.4, 319.9 299.2
C 316.0 302.1, 293.1 310.9, 291.2 314.0
C 289.2 317.0, 297.6 328.4, 298.8 332.5
C 300.0 336.6, 301.6 355.2, 304.0 358.9
C 306.5 362.6, 321.3 369.5, 325.6 373.2
C 329.8 376.9, 349.1 394.1, 350.1 399.2
C 351.1 404.4, 339.3 425.4, 336.7 428.9
C 334.1 432.5, 322.6 433.0, 321.9 437.6
C 321.3 442.1, 329.2 473.6, 329.5 478.3
C 329.9 483.0, 327.6 489.3, 326.0 489.2
C 324.4 489.0, 315.4 478.0, 312.2 476.8
C 309.1 475.5, 296.4 474.5, 291.8 475.5
C 287.1 476.5, 267.8 486.6, 261.6 487.5
C 255.3 488.4, 227.9 484.0, 223.9 485.3
C 219.9 486.7, 220.4 502.1, 217.9 502.0
C 215.4 501.9, 199.4 485.8, 196.2 484.6
C 193.1 483.3, 188.7 489.5, 183.3 488.0
C 178.0 486.5, 142.9 468.7, 138.0 468.2
C 133.0 467.6, 133.1 480.5, 128.9 481.6
C 124.8 482.7, 95.4 484.4, 92.7 480.2
C 90.0 475.9, 96.9 443.5, 99.6 435.5
C 102.2 427.5, 125.3 398.2, 121.9 393.0
C 118.5 387.9, 69.8 382.2, 62.7 379.3
C 55.6 376.4, 45.4 366.0, 44.1 361.9
C 42.7 357.8, 48.1 338.3, 47.8 334.4
C 47.4 330.5, 40.5 325.0, 40.4 319.8
C 40.4 314.5, 46.9 287.4, 47.2 277.5
C 47.6 267.5, 42.3 217.1, 44.1 211.1
C 46.0 205.2, 64.4 214.3, 67.6 212.3
C 70.7 210.3, 76.4 196.4, 78.5 189.0
C 80.6 181.7, 89.9 139.0, 90.4 131.8
C 91.0 124.5, 84.1 113.3, 84.3 110.2
C 84.4 107.0, 88.6 98.5, 92.2 97.1
C 95.8 95.7, 120.0 93.7, 123.5 94.8
C 127.0 95.8, 127.1 110.4, 130.1 108.8
C 133.1 107.3, 154.5 83.3, 156.1 78.3
C 157.8 73.3, 148.9 60.0, 148.1 54.5
C 147.3 49.1, 144.7 21.2, 147.2 18.7
C 149.6 16.3, 169.9 27.5, 174.5 27.5
C 179.2 27.4, 195.6 16.6, 197.8 18.0
C 200.0 19.4, 195.0 38.8, 198.5 42.4
C 201.9 45.9, 232.3 53.5, 235.7 56.8
C 239.1 60.2, 232.1 78.3, 235.6 79.2
C 239.0 80.1, 267.7 69.4, 273.0 66.6
C 278.3 63.8, 287.4 48.2, 293.2 48.7
C 298.9 49.2, 330.3 67.9, 335.9 71.8
C 341.5 75.7, 351.9 86.3, 354.5 90.9
Z`}
                />
              </defs>

              {/* Geographic Germany outline from Natural Earth boundary data */}
              <use
                href="#germany-shape"
                fill="#79C4ED"
                opacity="0.2"
                filter="url(#germany-shadow)"
                transform="translate(5 9)"
              />

              <use
                href="#germany-shape"
                fill="url(#germany-fill)"
                stroke="#83C9F0"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Travel routes */}
              <g
                stroke="#159BC9"
                strokeWidth="2"
                strokeDasharray="5 7"
                strokeLinecap="round"
                opacity="0.85"
              >
                <path d="M115 245 C160 180 210 205 246 150" />
                <path d="M246 150 C290 105 316 110 350 91" />
                <path d="M115 245 C165 300 235 350 284 395" />
              </g>

              {/* Map pins */}
              {[
                [115, 245],
                [246, 150],
                [350, 91],
                [284, 395],
                [190, 310],
                [300, 260],
              ].map(([cx, cy], index) => (
                <g key={index}>
                  <circle cx={cx} cy={cy} r="13" fill="#159BC9" opacity="0.13" />
                  <circle cx={cx} cy={cy} r="5" fill="#159BC9" />
                </g>
              ))}
            </svg>

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

            <div className="welcome-page__map-caption">
              <span>Germany</span>
              <span>One community, many cities</span>
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
