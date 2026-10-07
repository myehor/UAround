import Container from '../../components/layout/Container/Container'
import PopularEvents from '../../components/event/PopularEvents/PopularEvents'
import heroImage from '../../assets/images/hero-city.png'
import './HomePage.scss'

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-page__hero">
        <Container>
          <div
            className="home-page__hero-image"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="home-page__hero-overlay" />

            <div className="home-page__hero-content">
              <p className="home-page__eyebrow">
                Ukrainian events around you
              </p>

              <h1>
                Find Ukrainian events
                <br />
                around you.
              </h1>

              <p className="home-page__description">
                Discover what&apos;s happening in your city
                <br />
                and across your Bundesland.
              </p>

              <button
                type="button"
                className="home-page__location"
              >
                <span
                  className="home-page__location-icon"
                  aria-hidden="true"
                >
                  ●
                </span>

                <span>Würzburg, Bayern</span>

                <span aria-hidden="true">⌄</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      <section className="home-page__events">
        <Container>
          <PopularEvents />
        </Container>
      </section>
    </div>
  )
}

export default HomePage