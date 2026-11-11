import { useState } from "react";

import Container from "../Container/Container";
import { useAuth } from "../../../context/useAuth";

import "./Header.scss";

function Header() {
  const pathname = window.location.pathname;
  const { user, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomeActive = pathname === "/home";
  const isEventsActive = pathname === "/events";

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  const avatarLetter = user?.firstName?.charAt(0).toUpperCase() || "G";

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMobileMenu();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="header">
      <Container>
        <div className="header__inner">
          <a
            className="header__logo"
            href="/home"
            onClick={closeMobileMenu}
            aria-label="UAround — Home"
          >
            <img src="/images/uaround-logo.png" alt="UAround" />
          </a>

          <nav className="header__nav" aria-label="Main navigation">
            <a
              className={[
                "header__link",
                isHomeActive && "header__link--active",
              ]
                .filter(Boolean)
                .join(" ")}
              href="/home"
            >
              Home
            </a>

            <a
              className={[
                "header__link",
                isEventsActive && "header__link--active",
              ]
                .filter(Boolean)
                .join(" ")}
              href="/events"
            >
              Events
            </a>
          </nav>

          <a
            className="header__create"
            href="/events/create"
            onClick={closeMobileMenu}
          >
            <span aria-hidden="true">+</span>
            <span>Create Event</span>
          </a>

          <div className="header__account">
            {isLoading ? (
              <div
                className="header__account-loading"
                aria-label="Loading account"
              >
                …
              </div>
            ) : user ? (
              <a
                className="header__account-link"
                href="/profile"
                aria-label={`Open profile: ${displayName}`}
              >
                <span className="header__avatar" aria-hidden="true">
                  {avatarLetter}
                </span>
                <span className="header__profile-name">{displayName}</span>
                <span className="header__account-chevron" aria-hidden="true">
                  ⌄
                </span>
              </a>
            ) : (
              <a className="header__login" href="/login">
                <span className="header__login-icon" aria-hidden="true">
                  ♙
                </span>
                <span className="header__login-label">Log in</span>
                <span className="header__login-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            )}
          </div>

          <button
            className={[
              "header__menu-toggle",
              isMobileMenuOpen && "header__menu-toggle--open",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="header-mobile-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          id="header-mobile-menu"
          className={[
            "header__mobile-menu",
            isMobileMenuOpen && "header__mobile-menu--open",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label="Mobile navigation"
          aria-hidden={!isMobileMenuOpen}
        >
          <a
            className={[
              "header__mobile-link",
              isHomeActive && "header__mobile-link--active",
            ]
              .filter(Boolean)
              .join(" ")}
            href="/home"
            onClick={closeMobileMenu}
            tabIndex={isMobileMenuOpen ? 0 : -1}
          >
            Home
          </a>

          <a
            className={[
              "header__mobile-link",
              isEventsActive && "header__mobile-link--active",
            ]
              .filter(Boolean)
              .join(" ")}
            href="/events"
            onClick={closeMobileMenu}
            tabIndex={isMobileMenuOpen ? 0 : -1}
          >
            Events
          </a>

          {user && (
            <a
              className="header__mobile-link"
              href="/profile"
              onClick={closeMobileMenu}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              <span className="header__avatar" aria-hidden="true">
                {avatarLetter}
              </span>
              My profile
            </a>
          )}

          {!isLoading &&
            (user ? (
              <button
                className="header__mobile-link header__mobile-logout"
                type="button"
                onClick={() => void handleLogout()}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                Log out
              </button>
            ) : (
              <a
                className="header__mobile-link header__mobile-login"
                href="/login"
                onClick={closeMobileMenu}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                Log in <span aria-hidden="true">→</span>
              </a>
            ))}
        </nav>
      </Container>
    </header>
  );
}

export default Header;
