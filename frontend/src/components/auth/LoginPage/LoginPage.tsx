
import { useState, type FormEvent } from 'react'
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout'
import { loginUser } from '../../../api/auth'
import './LoginPage.scss'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      await loginUser({
        email: String(formData.get('email') ?? '').trim(),
        password: String(formData.get('password') ?? ''),
      })

      window.location.assign('/home')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Sign in failed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back!"
      description="Sign in to your account and continue exploring events."
    >
      <div className="login-page">
        <div className="login-page__header">
          <h2>Sign in</h2>
          <p>Enter your credentials to access your account.</p>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit}>
          <label className="login-page__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </label>

          <div className="login-page__field">
            <label htmlFor="login-password">Password</label>

            <div className="login-page__password">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-page__password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '◉' : '◌'}
              </button>
            </div>
          </div>

          <div className="login-page__forgot">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          {error && (
            <p role="alert" className="login-page__error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-page__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login-page__register">
          Don’t have an account?{' '}
          <a href="/register">Create account</a>
        </p>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
