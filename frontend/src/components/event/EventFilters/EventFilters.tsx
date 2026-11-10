import { useState } from "react";
import type { EventCategory } from "../../../types/event";
import { bundeslaender, getCities } from "../../../data/locations";

import "./EventFilters.scss";

type EventFiltersProps = {
  selectedCategory: EventCategory | "";
  onCategoryChange: (category: EventCategory | "") => void;
  selectedBundesland: string;
  selectedCity: string;
  selectedDateFrom: string;
  selectedDateTo: string;
  onBundeslandChange: (bundesland: string) => void;
  onCityChange: (city: string) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onReset: () => void;
};

function EventFilters({
  selectedCategory,
  onCategoryChange,
  selectedBundesland,
  selectedCity,
  selectedDateFrom,
  selectedDateTo,
  onBundeslandChange,
  onCityChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: EventFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableCities = getCities(selectedBundesland);

  const activeFilterCount = [
    selectedBundesland,
    selectedCity,
    selectedDateFrom,
    selectedDateTo,
    selectedCategory,
  ].filter(Boolean).length;

  const handleBundeslandChange = (value: string) => {
    onBundeslandChange(value);
    onCityChange("");
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <aside
      className={["event-filters", isOpen && "event-filters--open"]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="event-filters__mobile-header">
        <button
          type="button"
          className="event-filters__toggle"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
        >
          <span className="event-filters__toggle-label">
            <span aria-hidden="true">☷</span>
            Filters
            {activeFilterCount > 0 && (
              <span className="event-filters__count">{activeFilterCount}</span>
            )}
          </span>

          <span className="event-filters__chevron" aria-hidden="true">
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </div>

      <div className="event-filters__content">
        <div className="event-filters__header">
          <h2>Filters</h2>

          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="event-filters__section">
          <h3>Location</h3>

          <label>
            <span>Bundesland</span>

            <select
              value={selectedBundesland}
              onChange={(event) => handleBundeslandChange(event.target.value)}
            >
              <option value="">Select Bundesland</option>

              {bundeslaender.map((bundesland) => (
                <option key={bundesland} value={bundesland}>
                  {bundesland}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>City</span>

            <select
              value={selectedCity}
              onChange={(event) => onCityChange(event.target.value)}
              disabled={!selectedBundesland}
            >
              <option value="">
                {selectedBundesland ? "Select city" : "Select Bundesland first"}
              </option>

              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="event-filters__section">
          <h3>Date</h3>

          <label>
            <span>From</span>

            <input
              type="date"
              value={selectedDateFrom}
              onChange={(event) => onDateFromChange(event.target.value)}
            />
          </label>

          <label>
            <span>To</span>

            <input
              type="date"
              value={selectedDateTo}
              onChange={(event) => onDateToChange(event.target.value)}
            />
          </label>
        </div>

        <div className="event-filters__section">
          <h3>Category</h3>

          <label>
            <span>Event category</span>

            <select
              value={selectedCategory}
              onChange={(event) =>
                onCategoryChange(event.target.value as EventCategory | "")
              }
            >
              <option value="">All categories</option>
              <option value="Sport">Sport</option>
              <option value="Party">Party</option>
              <option value="Social">Social</option>
              <option value="Music">Music</option>
              <option value="IT & Networking">IT & Networking</option>
              <option value="Education">Education</option>
              <option value="Family">Family</option>
              <option value="Culture">Culture</option>
              <option value="Volunteering">Volunteering</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
      </div>
    </aside>
  );
}

export default EventFilters;
