import Container from '../Container/Container'
import './Header.scss'

function Header() {
  const pathname = window.location.pathname

  const isHomeActive = pathname === '/'
  const isEventsActive = pathname === '/events'

  return (
    <header className="header">
      <Container>
        <div className="header__inner">
          <a
            className="header__logo"
            href="/"
          >
            UAround
          </a>

          <nav
            className="header__nav"
            aria-label="Main navigation"
          >
            <a
              className={[
                'header__link',
                isHomeActive &&
                  'header__link--active',
              ]
                .filter(Boolean)
                .join(' ')}
              href="/"
            >
              Home
            </a>

            <a
              className={[
                'header__link',
                isEventsActive &&
                  'header__link--active',
              ]
                .filter(Boolean)
                .join(' ')}
              href="/events"
            >
              Events
            </a>
          </nav>

          <div className="header__actions">
            <a
              className="header__create"
              href="/events/create"
            >
              <span aria-hidden="true">
                +
              </span>
              Create Event
            </a>

            <a
              className="header__profile"
              href="/profile"
            >
              <span className="header__avatar">
                Y
              </span>

              <span className="header__profile-name">
                Yehor
              </span>

              <span aria-hidden="true">
                ⌄
              </span>
            </a>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header