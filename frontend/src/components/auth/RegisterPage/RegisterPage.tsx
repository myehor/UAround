import { useState } from 'react'
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout'
import './RegisterPage.scss'

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthLayout
      title="Find and join events with Ukrainian people in Germany."
      description="Sports, education, networking, culture and more. Real people. Real events."
    >
      <div className="register-page">
        <div className="register-page__header">
          <h2>Create an account</h2>

          <p>
            Join UAround and start exploring events
            in your city.
          </p>
        </div>

        <form className="register-page__form">
          <div className="register-page__row">
            <label className="register-page__field">
              <span>
                First name <strong>*</strong>
              </span>

              <input
                type="text"
                name="firstName"
                placeholder="First name"
                autoComplete="given-name"
              />
            </label>

            <label className="register-page__field">
              <span>
                Last name <strong>*</strong>
              </span>

              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="register-page__field">
            <span>
              Email <strong>*</strong>
            </span>

            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </label>

          <div className="register-page__field">
            <label htmlFor="register-password">
              Password <strong>*</strong>
            </label>

            <div className="register-page__password">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="register-page__password-toggle"
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

            <p className="register-page__hint">
              Minimum 8 characters, including a letter and a number.
            </p>
          </div>

          <div className="register-page__location">
            <div className="register-page__section-title">
              Location
            </div>

            <div className="register-page__row">
              <label className="register-page__field">
                <span>
                  Bundesland <strong>*</strong>
                </span>

                <select
                  name="bundesland"
                  defaultValue="Bayern"
                >
                  <option value="Bayern">
                    Bayern
                  </option>
                  <option value="Baden-Württemberg">
                    Baden-Württemberg
                  </option>
                  <option value="Berlin">
                    Berlin
                  </option>
                  <option value="Brandenburg">
                    Brandenburg
                  </option>
                  <option value="Bremen">
                    Bremen
                  </option>
                  <option value="Hamburg">
                    Hamburg
                  </option>
                  <option value="Hessen">
                    Hessen
                  </option>
                  <option value="Mecklenburg-Vorpommern">
                    Mecklenburg-Vorpommern
                  </option>
                  <option value="Niedersachsen">
                    Niedersachsen
                  </option>
                  <option value="Nordrhein-Westfalen">
                    Nordrhein-Westfalen
                  </option>
                  <option value="Rheinland-Pfalz">
                    Rheinland-Pfalz
                  </option>
                  <option value="Saarland">
                    Saarland
                  </option>
                  <option value="Sachsen">
                    Sachsen
                  </option>
                  <option value="Sachsen-Anhalt">
                    Sachsen-Anhalt
                  </option>
                  <option value="Schleswig-Holstein">
                    Schleswig-Holstein
                  </option>
                  <option value="Thüringen">
                    Thüringen
                  </option>
                </select>
              </label>

              <label className="register-page__field">
                <span>
                  City <strong>*</strong>
                </span>

                <select
                  name="city"
                  defaultValue="Würzburg"
                >
                  <option value="Würzburg">
                    Würzburg
                  </option>
                  <option value="Kitzingen">
                    Kitzingen
                  </option>
                  <option value="München">
                    München
                  </option>
                  <option value="Nürnberg">
                    Nürnberg
                  </option>
                  <option value="Augsburg">
                    Augsburg
                  </option>
                  <option value="Berlin">
                    Berlin
                  </option>
                  <option value="Hamburg">
                    Hamburg
                  </option>
                  <option value="Frankfurt">
                    Frankfurt
                  </option>
                  <option value="Köln">
                    Köln
                  </option>
                  <option value="Düsseldorf">
                    Düsseldorf
                  </option>
                </select>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="register-page__submit"
          >
            Create Account
          </button>
        </form>

        <p className="register-page__login">
          Already have an account?{' '}
          <a href="/login">
            Log in
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}

export default RegisterPage