import type { ReactNode } from 'react'
import './AuthLayout.scss'

type AuthLayoutProps = {
  children: ReactNode
  title: string
  description: string
}

function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="auth-layout">
      <div className="auth-layout__container">
        <section className="auth-layout__visual">
          <div className="auth-layout__visual-overlay" />

          <div className="auth-layout__brand">
            UAround
          </div>

          <div className="auth-layout__message">
            <h1>
              {title}
            </h1>

            <div className="auth-layout__divider" />

            <p>
              {description}
            </p>
          </div>
        </section>

        <section className="auth-layout__content">
          <div className="auth-layout__form">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthLayout