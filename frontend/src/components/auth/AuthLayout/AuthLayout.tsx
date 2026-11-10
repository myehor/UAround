import type { ReactNode } from "react";
import "./AuthLayout.scss";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <main className="auth-layout">
      <div className="auth-layout__container">
        <section className="auth-layout__visual">
          <div className="auth-layout__brand">
            <img src="/images/uaround-logo.png" alt="UAround" />
          </div>

          <div className="auth-layout__message">
            <h1>{title}</h1>

            <div className="auth-layout__divider" />

            <p>{description}</p>
          </div>

          <div className="auth-layout__visual-art" aria-hidden="true">
            <div className="auth-layout__route">
              <span className="auth-layout__pin" />
            </div>

            <div className="auth-layout__photo">
              <div className="auth-layout__photo-backdrop" />
            </div>
          </div>
        </section>

        <section className="auth-layout__content">
          <div className="auth-layout__form">{children}</div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
