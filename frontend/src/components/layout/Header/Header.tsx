import Container from '../Container/Container'
import './Header.scss'

function Header() {
  return (
    <header className="header">
      <Container>
        <div className="header__inner">
          <a className="header__logo" href="/">
            UAround
          </a>

          <nav className="header__nav" aria-label="Main navigation">
            <a className="header__link header__link--active" href="/">
              Home
            </a>

            <a className="header__link" href="/events">
              Events
            </a>

            <a className="header__link" href="/my-events">
              My Events
            </a>
          </nav>

          <div className="header__actions">
            <a className="header__create" href="/create-event">
              <span aria-hidden="true">+</span>
              Create Event
            </a>

            <a
              className="header__notification"
              href="/notifications"
              aria-label="Notifications"
            >
              <span aria-hidden="true">♟</span>
              <span className="header__notification-dot" />
            </a>

            <a className="header__profile" href="/profile">
              <span className="header__avatar">Y</span>

              <span className="header__profile-name">Yehor</span>

              <span aria-hidden="true">⌄</span>
            </a>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header