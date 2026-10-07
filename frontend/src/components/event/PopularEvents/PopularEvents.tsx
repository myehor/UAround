import { useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import EventCard from '../EventCard/EventCard'
import { mockEvents } from '../../../data/mockEvents'

import 'swiper/css'
import './PopularEvents.scss'

const carouselEvents = [
  ...mockEvents,
  ...mockEvents,
]

function PopularEvents() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSlideChange = (instance: SwiperInstance) => {
    setActiveIndex(instance.realIndex % mockEvents.length)
  }

  return (
    <section className="popular-events">
      <div className="popular-events__header">
        <div>
          <p className="popular-events__eyebrow">
            Popular Events
          </p>

          <h2 className="popular-events__title">
            Most popular events in Bayern right now
          </h2>
        </div>

        <a
          className="popular-events__view-all"
          href="/events"
        >
          View all
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="popular-events__carousel">
        <button
          type="button"
          className="popular-events__arrow popular-events__arrow--prev"
          aria-label="Previous events"
          onClick={() => swiper?.slidePrev()}
        >
          ←
        </button>

        <div className="popular-events__viewport">
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiper}
            onSlideChange={handleSlideChange}
            slidesPerView={5}
            spaceBetween={16}
            centeredSlides
            loop
            speed={700}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
                spaceBetween: 12,
              },
              700: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              1100: {
                slidesPerView: 5,
                spaceBetween: 16,
              },
            }}
            className="popular-events__swiper"
          >
            {carouselEvents.map((event, index) => (
              <SwiperSlide key={`${event.id}-${index}`}>
                {({ isActive, isPrev, isNext }) => (
                  <div
                    className={[
                      'popular-events__slide-card',
                      isActive &&
                        'popular-events__slide-card--active',
                      (isPrev || isNext) &&
                        'popular-events__slide-card--side',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <EventCard event={event} />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          type="button"
          className="popular-events__arrow popular-events__arrow--next"
          aria-label="Next events"
          onClick={() => swiper?.slideNext()}
        >
          →
        </button>
      </div>

      <div className="popular-events__dots">
        {mockEvents.map((event, index) => (
          <button
            key={event.id}
            type="button"
            className={[
              'popular-events__dot',
              index === activeIndex &&
                'popular-events__dot--active',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => swiper?.slideToLoop(index)}
            aria-label={`Go to ${event.title}`}
            aria-current={
              index === activeIndex ? 'true' : undefined
            }
          />
        ))}
      </div>
    </section>
  )
}

export default PopularEvents