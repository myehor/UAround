
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { getProfile, updateProfile, type UserProfile } from '../../api/profile'
import { getEvents } from '../../api/events'
import { useAuth } from '../../context/useAuth'
import { bundeslaender, getCities } from '../../data/locations'
import type { Event } from '../../types/event'

import './ProfilePage.scss'

type ProfileForm = {
  firstName: string
  lastName: string
  bundesland: string
  city: string
  bio: string
  phone: string
  languages: string
}

const emptyForm: ProfileForm = {
  firstName: '',
  lastName: '',
  bundesland: '',
  city: '',
  bio: '',
  phone: '',
  languages: '',
}

function toForm(profile: UserProfile): ProfileForm {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    bundesland: profile.bundesland,
    city: profile.city,
    bio: profile.bio ?? '',
    phone: profile.phone ?? '',
    languages: profile.languages.join(', '),
  }
}


type PhoneCountry = '+380' | '+49'

function getPhoneCountry(phone: string): PhoneCountry {
  return phone.startsWith('+380') ? '+380' : '+49'
}

function getPhoneDigits(phone: string, country: PhoneCountry): string {
  const digits = phone.replace(/\D/g, '')
  const countryDigits = country.slice(1)

  if (digits.startsWith(countryDigits)) {
    return digits.slice(countryDigits.length)
  }

  return digits
}

function formatPhoneNumber(value: string, country: PhoneCountry): string {
  const maxDigits = country === '+380' ? 9 : 11
  const digits = value.replace(/\D/g, '').slice(0, maxDigits)
  const groups = country === '+380' ? [2, 3, 4] : [3, 3, 2, 3]

  const parts: string[] = []
  let position = 0

  for (const size of groups) {
    if (position >= digits.length) break

    parts.push(digits.slice(position, position + size))
    position += size
  }

  return parts.join('-')
}

function formatStoredPhone(country: PhoneCountry, digits: string): string {
  const formatted = formatPhoneNumber(digits, country)
  return formatted ? `${country} ${formatted}` : ''
}


const AVAILABLE_LANGUAGES = [
  { name: 'Ukrainian', flag: '🇺🇦' },
  { name: 'German', flag: '🇩🇪' },
  { name: 'English', flag: '🇬🇧' },
  { name: 'Russian', flag: '🇷🇺' },
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'Portuguese', flag: '🇵🇹' },
  { name: 'Italian', flag: '🇮🇹' },
  { name: 'Polish', flag: '🇵🇱' },
  { name: 'Arabic', flag: '🇸🇦' },
] as const

function ProfilePage() {
  const { refreshUser, logout } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>('+49')
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(false)
  const languagesDropdownRef = useRef<HTMLDivElement>(null)

  const selectedLanguages = form.languages
    .split(',')
    .map((language) => language.trim())
    .filter(Boolean)

  const toggleLanguage = (language: string) => {
    const nextLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((item) => item !== language)
      : [...selectedLanguages, language]

    setForm({
      ...form,
      languages: nextLanguages.join(', '),
    })
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const availableCities = getCities(form.bundesland)

  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      setIsLoading(true)
      setError('')

      try {
        const userProfile = await getProfile()

        if (isActive) {
          setProfile(userProfile)
          setForm(toForm(userProfile))
          setPhoneCountry(getPhoneCountry(userProfile.phone ?? ''))
          setAvatarPreview(userProfile.avatarUrl ?? null)
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load your profile.',
          )
        }
      }

      try {
        const eventData = await getEvents()

        if (isActive) {
          setEvents(eventData)
        }
      } catch (eventError) {
        console.error('Failed to load profile events:', eventError)
      }

      if (isActive) {
        setIsLoading(false)
      }
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const openEditor = () => {
    if (profile) {
      setForm(toForm(profile))
      setPhoneCountry(getPhoneCountry(profile.phone ?? ''))
    }

    setError('')
    setSuccess('')
    setIsEditing(true)
  }

  const closeEditor = () => {
    if (profile) {
      setForm(toForm(profile))
      setPhoneCountry(getPhoneCountry(profile.phone ?? ''))
    }

    setIsEditing(false)
    setError('')
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('The image must be smaller than 5 MB.')
      event.target.value = ''
      return
    }

    const previewUrl = URL.createObjectURL(file)

    setAvatarPreview((previousPreview) => {
      if (previousPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview)
      }

      return previewUrl
    })

    setError('')
    setSuccess('Preview updated. Save the image permanently in a later step.')
    event.target.value = ''
  }

  
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const phoneDigits = getPhoneDigits(form.phone, phoneCountry)

    if (
      phoneDigits.length > 0 &&
      phoneDigits.length !== (phoneCountry === '+380' ? 9 : 11)
    ) {
      setError(
        phoneCountry === '+380'
          ? 'Please enter a valid Ukrainian phone number with 9 digits.'
          : 'Please enter a valid German phone number with 11 digits.',
      )
      return
    }

  setIsSaving(true)

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const savedProfile = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        bundesland: form.bundesland,
        city: form.city,
        bio: form.bio,
        phone: form.phone,
        languages: form.languages
          .split(',')
          .map((language) => language.trim())
          .filter(Boolean),
      })

      setProfile(savedProfile)
      setForm(toForm(savedProfile))
      await refreshUser()
      setIsEditing(false)
      setSuccess('Your profile has been saved.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save your profile.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.assign('/')
    } catch (error) {
      console.error('Failed to log out:', error)
      setError('Failed to log out. Please try again.')
    }
  }

  const attendingEvents = events.slice(0, 3)

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : ''

  const initials =
    `${profile?.firstName.charAt(0) ?? ''}${profile?.lastName.charAt(0) ?? ''}`.toUpperCase()

  const location = [profile?.city, profile?.bundesland]
    .filter(Boolean)
    .join(', ')

  const joinedDate = profile
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : ''

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="profile-page__content">
          <p>Loading your profile…</p>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div className="profile-page__content">
          <p
            className="profile-page__notice profile-page__notice--error"
            role="alert"
          >
            {error || 'Could not load your profile.'}
          </p>
          <a href="/login">Sign in</a>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-page__layout">
        <aside className="profile-page__sidebar">
          <nav
            className="profile-page__navigation"
            aria-label="Profile navigation"
          >
            <a
              href="/profile"
              className="profile-page__nav-item profile-page__nav-item--active"
            >
              <span aria-hidden="true">♙</span>
              Profile
            </a>

            <a href="/my-events" className="profile-page__nav-item">
              <span aria-hidden="true">▣</span>
              My Events
            </a>

            <a href="/settings" className="profile-page__nav-item">
              <span aria-hidden="true">⚙</span>
              Settings
            </a>

            <button
              type="button"
              className="profile-page__nav-item profile-page__nav-item--logout"
              onClick={handleLogout}
            >
              <span aria-hidden="true">↪</span>
              Log out
            </button>
          </nav>
        </aside>

        <div className="profile-page__content">
          {error && !isEditing && (
            <p
              className="profile-page__notice profile-page__notice--error"
              role="alert"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              className="profile-page__notice profile-page__notice--success"
              role="status"
            >
              {success}
            </p>
          )}

          <section className="profile-page__profile-card">
            <div className="profile-page__cover">
              {profile.coverUrl ? (
                <img src={profile.coverUrl} alt="Profile cover" />
              ) : (
                <div className="profile-page__cover-placeholder" />
              )}
            </div>

            <div className="profile-page__profile-info">
              <div className="profile-page__avatar-wrapper">
                {avatarPreview ? (
                  <img
                    className="profile-page__avatar-image"
                    src={avatarPreview}
                    alt={`${fullName} avatar`}
                  />
                ) : (
                  <div className="profile-page__avatar">
                    {initials || '?'}
                  </div>
                )}

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                  aria-label="Choose profile photo"
                />

                <button
                  type="button"
                  className="profile-page__avatar-button"
                  aria-label="Change profile photo"
                  title="Change profile photo"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  📷
                </button>
              </div>

              <div className="profile-page__identity">
                <h1>{fullName || 'Your profile'}</h1>

                <p>
                  <span aria-hidden="true">📍</span>
                  {location || 'Location not added yet'}
                </p>
              </div>

              <button
                type="button"
                className="profile-page__edit-profile"
                onClick={openEditor}
              >
                <span aria-hidden="true">✎</span>
                Edit Profile
              </button>
            </div>
          </section>

          <div className="profile-page__main-grid">
            <div className="profile-page__main-column">
              <section className="profile-page__panel profile-page__about">
                <div className="profile-page__panel-heading">
                  <h2>About me</h2>
                </div>

                <p className="profile-page__about-text">
                  {profile.bio?.trim() || 'Not added yet.'}
                </p>

                <div className="profile-page__about-meta">
                  <span>
                    <strong aria-hidden="true">📍</strong>
                    {location || '—'}
                  </span>

                  <span>
                    <strong aria-hidden="true">文</strong>
                    {profile.languages.length
                      ? profile.languages.join(', ')
                      : 'Not added yet'}
                  </span>

                  <span>
                    <strong aria-hidden="true">▣</strong>
                    Joined UAround: {joinedDate || '—'}
                  </span>
                </div>
              </section>

              <section className="profile-page__panel">
                <div className="profile-page__panel-heading">
                  <h2>My Events</h2>

                  <a href="/my-events" className="profile-page__view-all">
                    View all <span aria-hidden="true">→</span>
                  </a>
                </div>

                <div className="profile-page__tabs">
                  <button
                    type="button"
                    className="profile-page__tab profile-page__tab--active"
                  >
                    Events
                  </button>
                </div>

                {attendingEvents.length ? (
                  <div className="profile-page__event-grid">
                    {attendingEvents.map((event: Event) => (
                      <a
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="profile-page__event-card"
                      >
                        <div className="profile-page__event-image">
                          <img src={event.imageUrl} alt="" />
                        </div>

                        <div className="profile-page__event-content">
                          <span className="profile-page__event-category">
                            {event.category}
                          </span>

                          <h3>{event.title}</h3>

                          <p>
                            <span aria-hidden="true">▣</span>
                            {event.date} · {event.startTime}
                          </p>

                          <p>
                            <span aria-hidden="true">📍</span>
                            {event.venue}
                          </p>

                          <div className="profile-page__event-footer">
                            <span>{event.registeredCount} going</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p>You haven't joined or created any events yet.</p>
                )}
              </section>
            </div>

            <aside className="profile-page__right-column">
              <section className="profile-page__panel">
                <div className="profile-page__panel-heading">
                  <h2>Account</h2>
                </div>

                <div className="profile-page__account-list">
                  <div>
                    <span aria-hidden="true">✉</span>
                    <p>{profile.email || '—'}</p>
                  </div>

                  <div>
                    <span aria-hidden="true">☎</span>
                    <p>{profile.phone || 'Not added yet'}</p>
                  </div>
                </div>
              </section>

              <section className="profile-page__panel">
                <div className="profile-page__panel-heading">
                  <h2>Preferences</h2>
                </div>

                <div className="profile-page__preferences">
                  <div>
                    <span aria-hidden="true">📍</span>
                    <span>
                      <strong>Location</strong>
                      <small>{location || 'Not added yet'}</small>
                    </span>
                  </div>

                  <div>
                    <span aria-hidden="true">◎</span>
                    <span>
                      <strong>Languages</strong>
                      <small>
                        {profile.languages.length
                          ? profile.languages.join(', ')
                          : 'Not added yet'}
                      </small>
                    </span>
                  </div>
                </div>
              </section>
              <section className="profile-page__danger">
                <h2>Danger zone</h2>

                <p>
                  Deleting your account is permanent and cannot be undone.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    // Подключим удаление аккаунта после реализации backend.
                  }}
                >
                  <span aria-hidden="true">♜</span>
                  Delete account
                </button>
              </section>
            </aside>
          </div>
        </div>
      </div>

      {isEditing && (
        <div
          className="profile-editor-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditor()
            }
          }}
        >
          <section
            className="profile-editor"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-editor-title"
          >
            <div className="profile-editor__header">
              <div>
                <h2 id="profile-editor-title">Edit your profile</h2>
                <p>Your changes will be saved to your account.</p>
              </div>

              <button
                type="button"
                aria-label="Close editor"
                onClick={closeEditor}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="profile-editor__grid">
                <label>
                  First name
                  <input
                    required
                    maxLength={80}
                    value={form.firstName}
                    onChange={(event) =>
                      setForm({ ...form, firstName: event.target.value })
                    }
                  />
                </label>

                <label>
                  Last name
                  <input
                    required
                    maxLength={80}
                    value={form.lastName}
                    onChange={(event) =>
                      setForm({ ...form, lastName: event.target.value })
                    }
                  />
                </label>

                <label>
                  Bundesland
                  <select
                    required
                    value={form.bundesland}
                    onChange={(event) => {
                      const newBundesland = event.target.value
                      const newCities = getCities(newBundesland)

                      setForm({
                        ...form,
                        bundesland: newBundesland,
                        city: newCities[0] ?? '',
                      })
                    }}
                  >
                    {bundeslaender.map((bundesland) => (
                      <option key={bundesland} value={bundesland}>
                        {bundesland}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  City
                  <select
                    key={form.bundesland}
                    required
                    value={form.city}
                    onChange={(event) =>
                      setForm({ ...form, city: event.target.value })
                    }
                    disabled={availableCities.length === 0}
                  >
                    {form.city && !availableCities.includes(form.city) && (
                      <option value={form.city}>{form.city}</option>
                    )}

                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>

                
                <div className="profile-editor__full profile-editor__phone">
                  <span className="profile-editor__field-label">Phone</span>

                  <div className="profile-editor__phone-row">
                    <select
                      aria-label="Phone country code"
                      value={phoneCountry}
                      onChange={(event) => {
                        const country = event.target.value as PhoneCountry
                        const digits = getPhoneDigits(form.phone, phoneCountry)

                        setPhoneCountry(country)
                        setForm({
                          ...form,
                          phone: formatStoredPhone(country, digits),
                        })
                        setError('')
                      }}
                    >
                      <option value="+380">🇺🇦 +380</option>
                      <option value="+49">🇩🇪 +49</option>
                    </select>

                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={formatPhoneNumber(
                        getPhoneDigits(form.phone, phoneCountry),
                        phoneCountry,
                      )}
                      onChange={(event) => {
                        const digits = event.target.value.replace(/\D/g, '')

                        setForm({
                          ...form,
                          phone: formatStoredPhone(phoneCountry, digits),
                        })
                        setError('')
                      }}
                      placeholder={
                        phoneCountry === '+380'
                          ? 'XX-XXX-XXXX'
                          : 'XXX-XXX-XX-XXX'
                      }
                      aria-label="Phone number"
                      aria-describedby="profile-phone-hint"
                    />
                  </div>

                  <small id="profile-phone-hint">
                    {phoneCountry === '+380'
                      ? 'Enter 9 digits after +380.'
                      : 'Enter 11 digits after +49.'}
                  </small>
                </div>


                <label className="profile-editor__full">
                  About me
                  <textarea
                    maxLength={1000}
                    rows={4}
                    value={form.bio}
                    onChange={(event) =>
                      setForm({ ...form, bio: event.target.value })
                    }
                    placeholder="Tell people a little about yourself…"
                  />
                  <small>{form.bio.length}/1000 characters</small>
                </label>

                <div
                  className="profile-editor__full profile-editor__languages"
                  ref={languagesDropdownRef}
                >
                  <span className="profile-editor__field-label">Languages</span>

                  <p className="profile-editor__languages-description">
                    Select all languages you speak.
                  </p>

                  <button
                    type="button"
                    className="profile-editor__languages-trigger"
                    aria-expanded={isLanguagesOpen}
                    aria-haspopup="listbox"
                    onClick={() => setIsLanguagesOpen((open) => !open)}
                  >
                    <span className="profile-editor__languages-selected">
                      {selectedLanguages.length > 0 ? (
                        selectedLanguages.map((language) => {
                          const item = AVAILABLE_LANGUAGES.find(
                            (option) => option.name === language,
                          )

                          return (
                            <span
                              key={language}
                              className="profile-editor__language-tag"
                            >
                              {item?.flag ?? '🌐'} {language}
                              <span aria-hidden="true">×</span>
                            </span>
                          )
                        })
                      ) : (
                        <span className="profile-editor__languages-placeholder">
                          Choose languages
                        </span>
                      )}
                    </span>

                    <span
                      className={`profile-editor__languages-arrow ${
                        isLanguagesOpen ? 'profile-editor__languages-arrow--open' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>

                  {isLanguagesOpen && (
                    <div
                      className="profile-editor__languages-dropdown"
                      role="listbox"
                      aria-label="Available languages"
                      aria-multiselectable="true"
                    >
                      {AVAILABLE_LANGUAGES.map((language) => {
                        const isSelected = selectedLanguages.includes(language.name)

                        return (
                          <button
                            key={language.name}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            className={`profile-editor__language-option ${
                              isSelected
                                ? 'profile-editor__language-option--selected'
                                : ''
                            }`}
                            onClick={() => toggleLanguage(language.name)}
                          >
                            <span className="profile-editor__language-option-name">
                              <span className="profile-editor__language-flag">
                                {language.flag}
                              </span>
                              <span>{language.name}</span>
                            </span>

                            <span
                              className={`profile-editor__language-check ${
                                isSelected
                                  ? 'profile-editor__language-check--selected'
                                  : ''
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected ? '✓' : ''}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <small>
                    {selectedLanguages.length === 0
                      ? 'No languages selected.'
                      : `${selectedLanguages.length} ${
                          selectedLanguages.length === 1 ? 'language' : 'languages'
                        } selected`}
                  </small>
                </div>
              </div>

              {error && (
                <p
                  className="profile-page__notice profile-page__notice--error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="profile-editor__actions">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default ProfilePage
