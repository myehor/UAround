
import { useEffect, useState } from 'react'
import './HelpFeedback.scss'

type FeedbackType = 'problem' | 'idea' | 'question'

const feedbackOptions = [
  {
    type: 'problem' as const,
    icon: '🐛',
    title: 'Report a problem',
    description: "Something isn't working as expected.",
  },
  {
    type: 'idea' as const,
    icon: '💡',
    title: 'Suggest an idea',
    description: 'Tell us how we can improve UAround.',
  },
  {
    type: 'question' as const,
    icon: '💬',
    title: 'Ask a question',
    description: 'Need help with an event or your account?',
  },
]

const feedbackTitles: Record<FeedbackType, string> = {
  problem: 'Report a problem',
  idea: 'Suggest an idea',
  question: 'Ask a question',
}

function HelpFeedback() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] =
    useState<FeedbackType | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const closePanel = () => {
    setIsOpen(false)
    setSelectedType(null)
    setIsSubmitted(false)
    setSubject('')
    setMessage('')
    setEmail('')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <>
      <button
        type="button"
        className="help-feedback__trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open Help and Feedback"
      >
        <span className="help-feedback__trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>Help &amp; Feedback</span>
      </button>

      {isOpen && (
        <div
          className="help-feedback__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePanel()
          }}
        >
          <section
            className="help-feedback__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-feedback-title"
          >
            <header className="help-feedback__header">
              <div className="help-feedback__heading">
                <span className="help-feedback__header-icon" aria-hidden="true">
                  💬
                </span>
                <div>
                  <h2 id="help-feedback-title">Help &amp; Feedback</h2>
                  <p>We’re here to help you.</p>
                </div>
              </div>

              <button
                type="button"
                className="help-feedback__close"
                onClick={closePanel}
                aria-label="Close Help and Feedback"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="m18 6-12 12M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            {isSubmitted ? (
              <div className="help-feedback__success" role="status">
                <div className="help-feedback__success-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5 12 4 4L19 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Thank you for your feedback!</h3>
                <p>
                  Your message has been submitted successfully. We appreciate
                  you helping us improve UAround.
                </p>
                <button
                  type="button"
                  className="help-feedback__submit"
                  onClick={closePanel}
                >
                  Done
                </button>
              </div>
            ) : selectedType ? (
              <form className="help-feedback__form" onSubmit={handleSubmit}>
                <button
                  type="button"
                  className="help-feedback__back"
                  onClick={() => setSelectedType(null)}
                >
                  <span aria-hidden="true">←</span> Back to options
                </button>

                <h3>{feedbackTitles[selectedType]}</h3>
                <p className="help-feedback__form-intro">
                  Tell us a little more and we’ll take it from there.
                </p>

                <label htmlFor="feedback-subject">Subject</label>
                <input
                  id="feedback-subject"
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Briefly describe your message"
                  maxLength={120}
                  required
                />

                <label htmlFor="feedback-message">Message</label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="How can we help?"
                  rows={4}
                  maxLength={3000}
                  required
                />

                <label htmlFor="feedback-email">Email address</label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                  required
                />

                <p className="help-feedback__note">
                  This is a preview. Your message won’t be sent or saved yet.
                </p>

                <button type="submit" className="help-feedback__submit">
                  Submit
                </button>
              </form>
            ) : (
              <div className="help-feedback__options">
                <h3>How can we help you today?</h3>
                <p>Choose what you’d like to contact us about.</p>

                {feedbackOptions.map((option) => (
                  <button
                    type="button"
                    className="help-feedback__option"
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                  >
                    <span
                      className={`help-feedback__option-icon help-feedback__option-icon--${option.type}`}
                      aria-hidden="true"
                    >
                      {option.icon}
                    </span>
                    <span className="help-feedback__option-copy">
                      <strong>{option.title}</strong>
                      <span>{option.description}</span>
                    </span>
                    <span className="help-feedback__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}

export default HelpFeedback
