const SeatSummary = ({ seats }) => {
  const list = seats.map((s) => s.seatId).join(", ");
  return (
    <section className="booking-screen-section" aria-label="Selected seats summary">
      <h2 className="section-title">Selected Seats</h2>
      <p className="muted-text">{list || "No seats selected"}</p>
    </section>
  );
};

window.SeatSummary = SeatSummary;
