import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout";
import "./EmailConfirmedPage.scss";

function EmailConfirmedPage() {
  return (
    <AuthLayout
      title="You’re all set!"
      description="Your account is ready. Start discovering Ukrainian events and meeting people around you."
    >
      <div className="email-confirmed-page">
        <div className="email-confirmed-page__icon">✓</div>

        <div className="email-confirmed-page__header">
          <h2>Email confirmed</h2>

          <p>Your email address has been successfully verified.</p>

          <p>
            You can now sign in to your UAround account and start exploring
            events.
          </p>
        </div>

        <a className="email-confirmed-page__button" href="/login">
          Go to Sign In
        </a>
      </div>
    </AuthLayout>
  );
}

export default EmailConfirmedPage;
