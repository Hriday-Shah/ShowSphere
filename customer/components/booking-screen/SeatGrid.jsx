const SeatGrid = ({ rows, onToggleSeat, loading, error }) => {
  if (loading) {
    return (
      <section className="booking-screen-section" aria-label="Seat layout">
        <h2 className="section-title">Select Seats</h2>
        <p className="muted-text">Loading seats...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="booking-screen-section" aria-label="Seat layout">
        <h2 className="section-title">Select Seats</h2>
        <p className="muted-text">Seats unavailable</p>
      </section>
    );
  }

  return (
    <section className="booking-screen-section" aria-label="Seat layout">
      <h2 className="section-title">Select Seats</h2>
      <div className="screen-indicator-wrap">
        <p className="screen-label">SCREEN THIS WAY</p>
        <div className="screen-bar" aria-hidden="true" />
      </div>
      <div className="seat-layout-scroll">
        <div className="seat-layout">
          {rows.map((row) => (
            <div className="seat-row" key={row.row}>
              <span className="seat-row-label">{row.row}</span>
              <div className="seat-row-grid">
                {row.seats.map((seat) => (
                  <Seat key={seat.seatId} seat={seat} onToggle={onToggleSeat} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="seat-legend">
        <span><i className="legend legend--available" />Available</span>
        <span><i className="legend legend--booked" />Booked</span>
        <span><i className="legend legend--selected" />Selected</span>
        <span><i className="legend legend--premium" />Premium</span>
        <span><i className="legend legend--vip" />VIP</span>
      </div>
    </section>
  );
};

window.SeatGrid = SeatGrid;
