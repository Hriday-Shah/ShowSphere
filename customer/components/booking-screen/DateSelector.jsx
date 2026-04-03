const DateSelector = ({ dates, selectedDate, onSelectDate }) => {
  const fmt = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    };
  };

  return (
    <section className="booking-screen-section" aria-label="Date selection">
      <h2 className="section-title">Select Date</h2>
      <div className="date-strip" role="listbox" aria-label="Available dates">
        {dates.map((iso) => {
          const p = fmt(iso);
          const active = selectedDate === iso;
          return (
            <button
              key={iso}
              type="button"
              className={`date-card ${active ? "is-active" : ""}`}
              onClick={() => onSelectDate(iso)}
              aria-selected={active}
            >
              <span>{p.day}</span>
              <strong>{p.date}</strong>
              <span>{p.month}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

window.DateSelector = DateSelector;
