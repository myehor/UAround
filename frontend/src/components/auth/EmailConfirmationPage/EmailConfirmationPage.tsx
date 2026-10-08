import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout'
import './EmailConfirmationPage.scss'

function EmailConfirmationPage() {
  return (
    <AuthLayout
      title="Almost there!"
      description="One quick step and you’ll be ready to discover Ukrainian events around you."
    >
      <div className="email-confirmation-page">
        <div className="email-confirmation-page__icon">
          ✉
        </div>

        <div className="email-confirmation-page__header">
          <h2>Check your email</h2>

          <p>
            We’ve sent a confirmation link to
            <strong> your@email.com</strong>.
          </p>

          <p>
            Please check your inbox and click the link
            to verify your email address.
          </p>
        </div>

        <button
          type="button"
          className="email-confirmation-page__button"
        >
          Open Email
        </button>

        <div className="email-confirmation-page__resend">
          <span>Didn’t receive the email?</span>

          <button type="button">
            Resend link
          </button>
        </div>

        <a
          className="email-confirmation-page__back"
          href="/register"
        >
          ← Back to registration
        </a>
      </div>
    </AuthLayout>
  )
}

export default EmailConfirmationPage