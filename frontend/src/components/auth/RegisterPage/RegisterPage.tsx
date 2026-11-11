import { useState, type FormEvent } from "react";
import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout";
import { registerUser } from "../../../api/auth";
import { bundeslaender, getCities } from "../../../data/locations";
import "./RegisterPage.scss";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBundesland, setSelectedBundesland] = useState("Bayern");

  const availableCities = getCities(selectedBundesland);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const password = String(formData.get("password") ?? "");
    const email = String(formData.get("email") ?? "").trim();

    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      setIsSubmitting(false);
      return;
    }

    try {
      await registerUser({
        firstName: String(formData.get("firstName") ?? "").trim(),
        lastName: String(formData.get("lastName") ?? "").trim(),
        email,
        password,
        bundesland: String(formData.get("bundesland") ?? ""),
        city: String(formData.get("city") ?? ""),
      });

      window.location.assign("/home");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Find and join events with Ukrainian people in Germany."
      description="Sports, education, networking, culture and more. Real people. Real events."
    >
      <div className="register-page">
        <div className="register-page__header">
          <h2>Create an account</h2>
          <p>Join UAround and start exploring events in your city.</p>
        </div>

        <form className="register-page__form" onSubmit={handleSubmit}>
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
                maxLength={80}
                required
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
                maxLength={80}
                required
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
              maxLength={254}
              required
            />
          </label>

          <div className="register-page__field">
            <label htmlFor="register-password">
              Password <strong>*</strong>
            </label>

            <div className="register-page__password">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
              />

              <button
                type="button"
                className="register-page__password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </div>

            <p className="register-page__hint">
              Minimum 8 characters, including a letter and a number.
            </p>
          </div>

          <div className="register-page__location">
            <div className="register-page__section-title">Location</div>

            <div className="register-page__row">
              <label className="register-page__field">
                <span>
                  Bundesland <strong>*</strong>
                </span>
                <select
                  name="bundesland"
                  value={selectedBundesland}
                  onChange={(event) => {
                    setSelectedBundesland(event.target.value);
                  }}
                  required
                >
                  {bundeslaender.map((bundesland) => (
                    <option key={bundesland} value={bundesland}>
                      {bundesland}
                    </option>
                  ))}
                </select>
              </label>

              <label className="register-page__field">
                <span>
                  City <strong>*</strong>
                </span>
                <select
                  key={selectedBundesland}
                  name="city"
                  defaultValue={availableCities[0] ?? ""}
                  required
                  disabled={availableCities.length === 0}
                >
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {error && (
            <p role="alert" className="register-page__error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="register-page__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="register-page__login">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
