import { useState } from 'react'
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout'
import './ResetPasswordPage.scss'

function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  return (
    <AuthLayout
      title="Create a new password."
      description="Choose a strong password to keep your UAround account secure."
    >
      <div className="reset-password-page">
        <div className="reset-password-page__header">
          <h2>Set a new password</h2>

          <p>
            Enter your new password below. You’ll use it
            to sign in to your account.
          </p>
        </div>

        <form className="reset-password-page__form">
          <div className="reset-password-page__field">
            <label htmlFor="new-password">
              New password
            </label>

            <div className="reset-password-page__password">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="New password"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="reset-password-page__password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? '◉' : '◌'}
              </button>
            </div>

            <p className="reset-password-page__hint">
              Minimum 8 characters, including a letter and a number.
            </p>
          </div>

          <div className="reset-password-page__field">
            <label htmlFor="confirm-password">
              Confirm password
            </label>

            <div className="reset-password-page__password">
              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                name="confirmPassword"
                placeholder="Confirm password"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="reset-password-page__password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current,
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirmPassword ? '◉' : '◌'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="reset-password-page__submit"
          >
            Reset Password
          </button>
        </form>

        <a
          className="reset-password-page__back"
          href="/login"
        >
          ← Back to Sign In
        </a>
      </div>
    </AuthLayout>
  )
}

export default ResetPasswordPage