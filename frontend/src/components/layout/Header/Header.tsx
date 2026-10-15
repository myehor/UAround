
import Container from '../Container/Container';
import { useAuth } from '../../../context/useAuth';
import './Header.scss';

function Header() {
  const pathname = window.location.pathname;
  const { user, isLoading, logout } = useAuth();

  const isHomeActive = pathname === '/';
  const isEventsActive = pathname === '/events';

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Guest';

  const avatarLetter = user?.firstName?.charAt(0).toUpperCase() || 'G';

  const handleLogout = async () => {
    try {
      await logout();
      window.location.assign('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="header">
      <Container>
        <div className="header__inner">
          <a className="header__logo" href="/">
            UAround
          </a>

          <nav className="header__nav" aria-label="Main navigation">
            <a
              className={[
                'header__link',
                isHomeActive && 'header__link--active',
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
                isEventsActive && 'header__link--active',
              ]
                .filter(Boolean)
                .join(' ')}
              href="/events"
            >
              Events
            </a>
          </nav>

          <div className="header__actions">
            <a className="header__create" href="/events/create">
              <span aria-hidden="true">+</span>
              Create Event
            </a>

            {isLoading ? (
              <div className="header__profile">
                <span className="header__avatar">…</span>
                <span className="header__profile-name">Loading…</span>
              </div>
            ) : user ? (
              <div className="header__profile">
                <a className="header__profile" href="/profile">
                  <span className="header__avatar">{avatarLetter}</span>
                  <span className="header__profile-name">
                    {displayName}
                  </span>
                  <span aria-hidden="true">⌄</span>
                </a>

                <button type="button" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            ) : (
              <div className="header__profile">
                <a className="header__profile" href="/login">
                  <span className="header__avatar">G</span>
                  <span className="header__profile-name">Log in</span>
                </a>
                <a href="/register">Sign up</a>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
