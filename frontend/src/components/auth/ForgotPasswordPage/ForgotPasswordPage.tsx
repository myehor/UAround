import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout";
import "./ForgotPasswordPage.scss";

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot your password?"
      description="No worries. We’ll help you get back into your UAround account."
    >
      <div className="forgot-password-page">
        <div className="forgot-password-page__header">
          <h2>Reset your password</h2>

          <p>
            Enter the email address connected to your account and we’ll send you
            a reset link.
          </p>
        </div>

        <form className="forgot-password-page__form">
          <label className="forgot-password-page__field">
            <span>Email</span>

            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </label>

          <button type="submit" className="forgot-password-page__submit">
            Send Reset Link
          </button>
        </form>

        <a className="forgot-password-page__back" href="/login">
          ← Back to Sign In
        </a>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
