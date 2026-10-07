import './Footer.scss'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__waves" aria-hidden="true" />

      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <a
              href="/"
              className="footer__logo"
            >
              UAround
            </a>

            <p className="footer__description">
              Ukrainian events around you.
              <br />
              Connect, meet and experience
              <br />
              Germany together.
            </p>

            <div className="footer__socials">
              <a
                href="#"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="17.2"
                    cy="6.8"
                    r="1"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="YouTube"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="12"
                    rx="4"
                    fill="currentColor"
                  />
                  <path
                    d="m10 9 5 3-5 3V9Z"
                    fill="#f2f9fd"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 8.5A2 2 0 1 0 6.5 4.5a2 2 0 0 0 0 4ZM5 10h3v9H5v-9Zm5 0h3v1.3c.7-.9 1.8-1.7 3.6-1.7 3 0 4.4 1.9 4.4 5.2V19h-3v-3.8c0-1.8-.6-2.7-2-2.7-1.5 0-2 1-2 2.8V19h-3v-9Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__column">
            <h3>Help & Support</h3>

            <a href="/contact">
              Contact
            </a>

            <a href="/faq">
              FAQ
            </a>

            <a href="/help">
              Help Center
            </a>

            <a href="/report">
              Report an Issue
            </a>
          </div>

          <div className="footer__column">
            <h3>Legal</h3>

            <a href="/impressum">
              Impressum
            </a>

            <a href="/datenschutz">
              Datenschutz
            </a>

            <a href="/cookies">
              Cookie-Einstellungen
            </a>

            <a href="/terms">
              Nutzungsbedingungen
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © 2026 UAround. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer