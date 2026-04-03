const BookingHomepage = () => {
  const [dataset, setDataset] = React.useState(null);
  const [category, setCategory] = React.useState("movies");
  const [selectedId, setSelectedId] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [city, setCity] = React.useState(window.bookingDataService.getCity());

  const fallbackProfile = React.useMemo(
    () => `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#1f1f2a"/><circle cx="60" cy="42" r="22" fill="#7f7f91"/><rect x="24" y="74" width="72" height="30" rx="15" fill="#7f7f91"/></svg>')}`,
    []
  );

  React.useEffect(() => {
    if (sessionStorage.getItem("cinema_customer_session") !== "1") {
      window.location.replace("login.html");
      return;
    }

    window.bookingDataService.loadDataset().then((d) => {
      setDataset(d);
      const params = new URLSearchParams(window.location.search);
      const t = params.get("type") || "movies";
      const id = params.get("id") || "";
      setCategory(["movies", "events", "plays", "sports"].includes(t) ? t : "movies");
      setSelectedId(id);
    });

    const timer = setInterval(() => setCity(window.bookingDataService.getCity()), 2000);
    return () => clearInterval(timer);
  }, []);

  const list = React.useMemo(() => (dataset ? dataset[category] || [] : []), [dataset, category]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => String(item.title || "").toLowerCase().includes(q));
  }, [list, search]);

  React.useEffect(() => {
    if (!filtered.length) return;
    if (!filtered.some((x) => x.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = React.useMemo(() => filtered.find((x) => x.id === selectedId) || filtered[0] || null, [filtered, selectedId]);

  const isMovieOrPlay = category === "movies" || category === "plays";

  const onCategoryClick = (next) => {
    setCategory(next);
    setSelectedId("");
    const params = new URLSearchParams(window.location.search);
    params.set("type", next);
    params.delete("id");
    window.history.replaceState({}, "", `booking.html?${params.toString()}`);
  };

  const onSelectFromSearch = (e) => {
    if (e.key !== "Enter") return;
    const first = filtered[0];
    if (!first) return;
    setSelectedId(first.id);
  };

  if (!dataset || !selected) {
    return <main className="booking-main"><p className="booking-loading">Loading booking details…</p></main>;
  }

  return (
    <>
      <Header city={city} searchValue={search} onSearchChange={setSearch} onBookTickets={() => (window.location.href = "booking-screen.html")} />

      <nav className="ribbon" aria-label="Entertainment categories">
        {[
          { id: "movies", label: "Movies" },
          { id: "events", label: "Events" },
          { id: "plays", label: "Plays" },
          { id: "sports", label: "Sports" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`ribbon__tab ${category === tab.id ? "ribbon__tab--active" : ""}`}
            data-category-tab={tab.id}
            aria-selected={category === tab.id}
            onClick={() => onCategoryClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="booking-main" onKeyDown={onSelectFromSearch}>
        <section className="booking-section booking-picker">
          <h2 className="section-title">Now viewing</h2>
          <div className="booking-chip-row">
            {filtered.map((item) => (
              <button key={item.id} type="button" className={`booking-chip ${selected?.id === item.id ? "booking-chip--active" : ""}`} onClick={() => setSelectedId(item.id)}>
                {item.title}
              </button>
            ))}
          </div>
        </section>

        <EntertainmentBanner bannerImage={selected.bannerImage || selected.image} title={selected.title} />
        <DescriptionSection description={selected.description} />
        {isMovieOrPlay && <CastSection cast={selected.cast} fallbackImage={fallbackProfile} />}
        {isMovieOrPlay && <CrewSection crew={selected.crew} fallbackImage={fallbackProfile} />}
        <ReviewsSection reviews={selected.reviews} />
      </main>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("booking-app")).render(<BookingHomepage />);
window.BookingHomepage = BookingHomepage;
