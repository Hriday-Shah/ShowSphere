const PriceSummary = ({ selectedSeats, pricing }) => {
  const count = selectedSeats.length;
  const avg = count ? Math.round(selectedSeats.reduce((a, s) => a + s.price, 0) / count) : 0;
  const total = selectedSeats.reduce((a, s) => a + s.price, 0);

  return (
    <section className="booking-screen-section" aria-label="Price summary">
      <h2 className="section-title">Price Summary</h2>
      <div className="price-grid">
        <p>Tickets</p><strong>{count}</strong>
        <p>Price per ticket</p><strong>INR {avg}</strong>
        <p>Total</p><strong>INR {total}</strong>
      </div>
    </section>
  );
};

window.PriceSummary = PriceSummary;
