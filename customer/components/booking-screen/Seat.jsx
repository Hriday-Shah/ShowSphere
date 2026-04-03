const Seat = React.memo(function Seat({ seat, onToggle }) {
  const className = `seat seat--${seat.type} seat--${seat.status}`;
  return (
    <button
      type="button"
      className={className}
      onClick={() => onToggle(seat)}
      disabled={seat.status === "booked"}
      aria-label={`${seat.seatId} ${seat.type} ${seat.status}`}
      title={seat.seatId}
    >
      {seat.seatId}
    </button>
  );
});

window.Seat = Seat;
