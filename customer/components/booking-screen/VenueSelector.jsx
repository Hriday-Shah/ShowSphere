const VenueSelector = ({ venues, selectedShowtimeKey, onSelectShowtime, disabled }) => {
  return (
    <section className="booking-screen-section" aria-label="Venue and showtime">
      <h2 className="section-title">Select Venue & Showtime</h2>
      <div className="venue-list">
        {venues.map((venue) => (
          <article className="venue-card" key={venue.name}>
            <h3>{venue.name}</h3>
            <div className="showtime-row">
              {venue.showtimes.map((time) => {
                const key = `${venue.name}__${time}`;
                const active = selectedShowtimeKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`showtime-btn ${active ? "is-active" : ""}`}
                    onClick={() => onSelectShowtime({ venue: venue.name, time, key })}
                    disabled={disabled}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

window.VenueSelector = VenueSelector;
