import "./CommunityAction.scss";

function CommunityAction() {
  return (
    <section className="community-action">
      <div className="community-action__content">
        <p className="community-action__eyebrow">COMMUNITY</p>

        <h2 className="community-action__title">
          Find or create
          <br />
          your event.
        </h2>

        <p className="community-action__description">
          Meet new people, share your interests
          <br />
          and be part of a growing Ukrainian
          <br />
          community in Germany.
        </p>

        <div className="community-action__actions">
          <a
            href="/events"
            className="community-action__button community-action__button--primary"
          >
            Browse Events
          </a>

          <a
            href="/events/create"
            className="community-action__button community-action__button--secondary"
          >
            <span aria-hidden="true">+</span>
            Create Event
          </a>
        </div>
      </div>

      <div className="community-action__visual" aria-hidden="true">
        <div className="community-action__image community-action__image--main">
          <img src="https://picsum.photos/seed/meetpeople/700/500" alt="" />
        </div>

        <div className="community-action__image community-action__image--top">
          <img src="https://picsum.photos/seed/exploreplaces/500/350" alt="" />
        </div>

        <div className="community-action__image community-action__image--bottom">
          <img src="https://picsum.photos/seed/shareinterests/500/350" alt="" />
        </div>

        <div className="community-action__tag community-action__tag--people">
          <span>♟</span>
          Meet people
        </div>

        <div className="community-action__tag community-action__tag--places">
          <span>●</span>
          Explore places
        </div>

        <div className="community-action__tag community-action__tag--interests">
          <span>♥</span>
          Share interests
        </div>

        <span className="community-action__decoration community-action__decoration--one">
          ╲
        </span>

        <span className="community-action__decoration community-action__decoration--two">
          ╱
        </span>

        <span className="community-action__message">
          More than just
          <br />
          events
          <br />
          <span>♡</span>
        </span>
      </div>
    </section>
  );
}

export default CommunityAction;
