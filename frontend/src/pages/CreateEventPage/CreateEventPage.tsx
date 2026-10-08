import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import './CreateEventPage.scss'

const eventCategories = [
  'Sports',
  'Culture',
  'Music',
  'Education',
  'Networking',
  'Food & Drinks',
  'Travel',
  'Business',
]

function CreateEventPage() {
  const [selectedCategory, setSelectedCategory] = useState('Sports')
  const [eventImage, setEventImage] = useState(
    'https://picsum.photos/seed/uaround-football/800/450',
  )

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setEventImage(imageUrl)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="create-event-page">
      <div className="create-event-page__layout">
        <aside className="create-event-page__steps">
          <div className="create-event-page__step create-event-page__step--active">
            <span>1</span>
            <strong>Basic<br />Information</strong>
          </div>

          <div className="create-event-page__step">
            <span>2</span>
            <strong>Date &amp; Location</strong>
          </div>

          <div className="create-event-page__step">
            <span>3</span>
            <strong>Category</strong>
          </div>

          <div className="create-event-page__step">
            <span>4</span>
            <strong>Description</strong>
          </div>

          <div className="create-event-page__step">
            <span>5</span>
            <strong>Review</strong>
          </div>
        </aside>

        <form
          className="create-event-page__form"
          onSubmit={handleSubmit}
        >
          <div className="create-event-page__form-heading">
            <h1>Create a new event</h1>
            <p>
              Bring Ukrainian people together by creating your own event.
              <br />
              It’s free and only takes a few minutes.
            </p>
          </div>

          <section className="create-event-page__section">
            <div className="create-event-page__section-title">
              <span>1.</span>
              <h2>Basic Information</h2>
            </div>

            <label className="create-event-page__field">
              <span>
                Event title <b>*</b>
              </span>

              <input
                type="text"
                name="title"
                defaultValue="Ukrainian Football Meetup"
                maxLength={100}
              />

              <small className="create-event-page__character-count">
                24/100
              </small>
            </label>

            <div className="create-event-page__image-field">
              <div>
                <label className="create-event-page__field-label">
                  Event image <b>*</b>
                </label>

                <label className="create-event-page__upload">
                  <span className="create-event-page__upload-icon">
                    ＋
                  </span>

                  <strong>Upload event image</strong>
                  <small>JPG, PNG · Max 5 MB</small>

                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="create-event-page__selected-image">
                <img src={eventImage} alt="Event preview" />

                <button
                  type="button"
                  aria-label="Remove event image"
                  onClick={() => setEventImage('')}
                >
                  ×
                </button>
              </div>
            </div>
          </section>

          <section className="create-event-page__section">
            <div className="create-event-page__section-title">
              <span>2.</span>
              <h2>Date &amp; Location</h2>
            </div>

            <label className="create-event-page__field">
              <span>
                Date <b>*</b>
              </span>

              <input
                type="date"
                name="date"
                defaultValue="2026-10-17"
              />
            </label>

            <div className="create-event-page__two-columns">
              <label className="create-event-page__field">
                <span>
                  Start time <b>*</b>
                </span>

                <input
                  type="time"
                  name="startTime"
                  defaultValue="18:00"
                />
              </label>

              <label className="create-event-page__field">
                <span>
                  End time <small>(optional)</small>
                </span>

                <input
                  type="time"
                  name="endTime"
                  defaultValue="20:00"
                />
              </label>
            </div>

            <label className="create-event-page__field">
              <span>
                Location <b>*</b>
              </span>

              <input
                type="text"
                name="city"
                defaultValue="Würzburg"
              />
            </label>

            <label className="create-event-page__field">
              <span>
                Specific venue / address <small>(optional)</small>
              </span>

              <input
                type="text"
                name="venue"
                defaultValue="Sportplatz Sanderau, Sanderauer Str. 25, 97072 Würzburg"
              />
            </label>

            <div className="create-event-page__map">
              <div className="create-event-page__map-city">
                Würzburg
              </div>

              <div className="create-event-page__map-pin">
                <span>●</span>
              </div>

              <div className="create-event-page__map-card">
                <strong>Sportplatz Sanderau</strong>
                <span>Sanderauer Str. 25</span>
                <span>97072 Würzburg</span>
              </div>
            </div>
          </section>

          <section className="create-event-page__section">
            <div className="create-event-page__section-title">
              <span>3.</span>
              <div>
                <h2>Category</h2>
                <p>Choose the category that best fits your event.</p>
              </div>
            </div>

            <div className="create-event-page__categories">
              {eventCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category
                      ? 'create-event-page__category create-event-page__category--active'
                      : 'create-event-page__category'
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>
                    {category === 'Sports' && '⚽'}
                    {category === 'Culture' && '🎭'}
                    {category === 'Music' && '♫'}
                    {category === 'Education' && '🎓'}
                    {category === 'Networking' && '👥'}
                    {category === 'Food & Drinks' && '🍴'}
                    {category === 'Travel' && '✈'}
                    {category === 'Business' && '💼'}
                  </span>

                  {category}
                </button>
              ))}
            </div>
          </section>

          <section className="create-event-page__section">
            <div className="create-event-page__section-title">
              <span>4.</span>
              <div>
                <h2>Description</h2>
                <p>
                  Tell people more about your event. What will you do?
                  Who is it for?
                </p>
              </div>
            </div>

            <label className="create-event-page__field">
              <textarea
                name="description"
                rows={6}
                defaultValue={`Let’s meet and play football together! ⚽

A friendly game for Ukrainians in Würzburg. All skill levels are welcome – whether you play often or just for fun.

We’ll have a full-size field, good music, and a relaxed atmosphere.
Bring sports clothes, football shoes, water, and good mood! 💪`}
                maxLength={1000}
              />

              <small className="create-event-page__character-count">
                287/1000
              </small>
            </label>
          </section>

          <section className="create-event-page__section">
            <div className="create-event-page__section-title">
              <span>5.</span>
              <div>
                <h2>Review and Create</h2>
                <p>
                  Once you’re ready, create your event and share it with
                  the community.
                </p>
              </div>
            </div>

            <label className="create-event-page__checkbox">
              <input type="checkbox" defaultChecked />

              <span>
                I confirm that this event is open to everyone in the
                Ukrainian community and follows the UAround{' '}
                <a href="/community-guidelines">
                  community guidelines
                </a>
                .
              </span>
            </label>

            <div className="create-event-page__actions">
              <a href="/events" className="create-event-page__cancel">
                Cancel
              </a>

              <button
                type="submit"
                className="create-event-page__submit"
              >
                <span aria-hidden="true">✣</span>
                Create Event
              </button>
            </div>
          </section>
        </form>

        <aside className="create-event-page__preview">
          <section className="create-event-page__preview-card">
            <h2>Event Preview</h2>

            <p>Here’s how your event will look to other users.</p>

            <div className="create-event-page__event-preview">
              {eventImage && (
                <img
                  src={eventImage}
                  alt="Event preview"
                />
              )}

              <div className="create-event-page__event-preview-content">
                <span className="create-event-page__preview-category">
                  {selectedCategory}
                </span>

                <h3>Ukrainian Football Meetup</h3>

                <p>
                  <span aria-hidden="true">▣</span>
                  Sat, 17 Oct 2026 · 18:00 – 20:00
                </p>

                <p>
                  <span aria-hidden="true">📍</span>
                  Sportplatz Sanderau, Würzburg
                </p>

                <div className="create-event-page__preview-participants">
                  <div>
                    <span>Y</span>
                    <span>A</span>
                    <span>O</span>
                    <span>M</span>
                  </div>

                  <small>0 going</small>
                </div>

                <button type="button">
                  Register
                </button>

                <div className="create-event-page__preview-description">
                  <p>
                    Let’s meet and play football together! ⚽
                  </p>

                  <p>
                    A friendly game for Ukrainians in Würzburg. All
                    skill levels are welcome – whether you play often
                    or just for fun.
                  </p>

                  <p>
                    We’ll have a full-size field, good music, and a
                    relaxed atmosphere.
                  </p>

                  <p>
                    Bring sports clothes, football shoes, water, and
                    good mood! 💪
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="create-event-page__tips">
            <div className="create-event-page__tips-title">
              <span>💡</span>
              <h2>Tips for a great event</h2>
            </div>

            <div className="create-event-page__tip">
              <span>📷</span>
              <div>
                <strong>Use a clear and attractive image</strong>
                <p>It helps people notice your event.</p>
              </div>
            </div>

            <div className="create-event-page__tip">
              <span>▤</span>
              <div>
                <strong>Write a short and clear title</strong>
                <p>Make it easy to understand.</p>
              </div>
            </div>

            <div className="create-event-page__tip">
              <span>📍</span>
              <div>
                <strong>Add a specific location</strong>
                <p>A clear address helps people find you.</p>
              </div>
            </div>

            <div className="create-event-page__tip">
              <span>👥</span>
              <div>
                <strong>Be specific in the description</strong>
                <p>Tell what to expect and who can join.</p>
              </div>
            </div>

            <div className="create-event-page__tip">
              <span>♥</span>
              <div>
                <strong>Create a friendly atmosphere</strong>
                <p>Your event will attract more people!</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}

export default CreateEventPage