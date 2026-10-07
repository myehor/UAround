import './CommunityImpact.scss'

function CommunityImpact() {
  return (
    <section className="community-impact">
      <div className="community-impact__decor community-impact__decor--left" />

      <div className="community-impact__content">
        <p className="community-impact__eyebrow">
          OUR COMMUNITY
        </p>

        <h2 className="community-impact__title">
          A growing community
          <br />
          across Germany.
        </h2>

        <p className="community-impact__description">
          UAround helps Ukrainian people connect,
          <br />
          meet and create meaningful experiences.
        </p>
      </div>

      <div className="community-impact__stats">
        <div className="community-impact__stat">
          <div className="community-impact__stat-icon">
            ♟
          </div>

          <strong>2,500+</strong>

          <span>community members</span>
        </div>

        <div className="community-impact__stat">
          <div className="community-impact__stat-icon">
            ▣
          </div>

          <strong>320+</strong>

          <span>events created</span>
        </div>

        <div className="community-impact__stat">
          <div className="community-impact__stat-icon">
            ●
          </div>

          <strong>15+</strong>

          <span>cities in Germany</span>
        </div>
      </div>

      <div className="community-impact__visual">
        <div className="community-impact__image">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
            alt=""
          />
        </div>

        <div className="community-impact__message">
          Same culture.
          <br />
          New places.
          <br />
          Great people.
          <br />
          <span>♡</span>
        </div>
      </div>

      <div className="community-impact__decor community-impact__decor--bottom" />
    </section>
  )
}

export default CommunityImpact