const EntertainmentBanner = ({ bannerImage, title }) => {
  return (
    <section className="booking-section banner-section" aria-label="Entertainment banner">
      <img className="booking-banner-image" src={bannerImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80"} alt={title || "Entertainment banner"} />
    </section>
  );
};
window.EntertainmentBanner = EntertainmentBanner;
