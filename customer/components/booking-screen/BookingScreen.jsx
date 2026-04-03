const BookingScreen = () => {
  const [dataset, setDataset] = React.useState(null);
  const [city, setCity] = React.useState(window.bookingDataService.getCity());
  const [category, setCategory] = React.useState("movies");
  const [itemId, setItemId] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedShowtime, setSelectedShowtime] = React.useState(null);
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [seatRows, setSeatRows] = React.useState([]);
  const [loadingSeats, setLoadingSeats] = React.useState(true);
  const [seatError, setSeatError] = React.useState(false);

  React.useEffect(() => {
    if (sessionStorage.getItem("cinema_customer_session") !== "1") {
      window.location.replace("login.html");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const t = params.get("type") || "movies";
    const id = params.get("id") || "";
    setCategory(["movies", "events", "plays", "sports"].includes(t) ? t : "movies");
    setItemId(id);

    window.bookingDataService.loadDataset().then((d) => {
      setDataset(d);
      setLoadingSeats(false);
    }).catch(() => {
      setSeatError(true);
      setLoadingSeats(false);
    });

    const timer = setInterval(() => setCity(window.bookingDataService.getCity()), 2000);
    return () => clearInterval(timer);
  }, []);

  const list = React.useMemo(() => (dataset ? dataset[category] || [] : []), [dataset, category]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((x) => String(x.title || "").toLowerCase().includes(q));
  }, [list, search]);

  const item = React.useMemo(() => filtered.find((x) => x.id === itemId) || filtered[0] || null, [filtered, itemId]);

  React.useEffect(() => {
    if (!item) return;
    setItemId(item.id);
  }, [item]);

  const config = React.useMemo(() => dataset?.["booking-config"]?.default || null, [dataset]);

  const dates = React.useMemo(() => item?.dates || config?.dates || [], [item, config]);
  const venues = React.useMemo(() => item?.venues || config?.venues || [], [item, config]);
  const pricing = React.useMemo(() => item?.pricing || config?.pricing || { regular: 250, premium: 350, vip: 500 }, [item, config]);

  const buildSeatRows = React.useCallback(() => {
    const layout = item?.seatLayout || config?.seatLayout;
    if (!layout) return [];
    return layout.map((row) => ({
      row: row.row,
      seats: row.seats.map((s) => {
        const seatId = `${row.row}${s.number}`;
        const type = s.type || "regular";
        const price = pricing[type] ?? pricing.regular;
        const chosen = selectedSeats.some((x) => x.seatId === seatId);
        return {
          seatId,
          row: row.row,
          number: s.number,
          type,
          status: chosen ? "selected" : s.status,
          price,
        };
      }),
    }));
  }, [item, config, pricing, selectedSeats]);

  React.useEffect(() => {
    if (!dataset) return;
    setSeatRows(buildSeatRows());
  }, [dataset, buildSeatRows]);

  const onSelectDate = (d) => {
    setSelectedDate(d);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const onSelectShowtime = (show) => {
    if (!selectedDate) return;
    if (!selectedShowtime || selectedShowtime.key !== show.key) {
      setSelectedSeats([]);
    }
    setSelectedShowtime(show);
  };

  const onToggleSeat = (seat) => {
    if (!selectedDate || !selectedShowtime) return;
    if (seat.status === "booked") return;
    setSelectedSeats((prev) => {
      const exists = prev.some((x) => x.seatId === seat.seatId);
      if (exists) return prev.filter((x) => x.seatId !== seat.seatId);
      return [...prev, { ...seat, status: "selected" }];
    });
  };

  const onCategoryClick = (next) => {
    setCategory(next);
    setSelectedDate("");
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setSearch("");
    const params = new URLSearchParams(window.location.search);
    params.set("type", next);
    params.delete("id");
    window.history.replaceState({}, "", `booking-screen.html?${params.toString()}`);
  };

  const canProceed = selectedSeats.length > 0 && selectedDate && selectedShowtime;

  return (
    <>
      <Header city={city} searchValue={search} onSearchChange={setSearch} onBookTickets={() => (window.location.href = "/booking-screen")} />

      <nav className="ribbon" aria-label="Entertainment categories">
        {["movies", "events", "plays", "sports"].map((tab) => (
          <button key={tab} type="button" className={`ribbon__tab ${category === tab ? "ribbon__tab--active" : ""}`} onClick={() => onCategoryClick(tab)}>
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="booking-screen-main">
        <DateSelector dates={dates} selectedDate={selectedDate} onSelectDate={onSelectDate} />

        <VenueSelector venues={venues} selectedShowtimeKey={selectedShowtime?.key} onSelectShowtime={onSelectShowtime} disabled={!selectedDate} />

        <SeatGrid rows={seatRows} onToggleSeat={onToggleSeat} loading={loadingSeats} error={seatError || !seatRows.length} />

        <SeatSummary seats={selectedSeats} />

        <PriceSummary selectedSeats={selectedSeats} pricing={pricing} />

        <section className="booking-screen-section booking-cta-wrap" aria-label="Continue">
          <button type="button" className="booking-cta" disabled={!canProceed} onClick={() => (window.location.href = "/payment-page")}>
            Proceed to Payment
          </button>
        </section>
      </main>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("booking-screen-app")).render(<BookingScreen />);
window.BookingScreen = BookingScreen;
