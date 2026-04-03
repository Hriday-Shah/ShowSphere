const CastSection = ({ cast, fallbackImage }) => {
  if (!cast || !cast.length) return null;
  return (
    <section className="booking-section" aria-label="Cast">
      <h2 className="section-title">Cast</h2>
      <div className="people-grid">
        {cast.map((member, idx) => (
          <article className="person-card" key={`cast-${idx}`}>
            <img src={member.photo || fallbackImage} alt={member.name || "Cast member"} className="person-avatar" loading="lazy" />
            <p className="person-name">{member.name || "Name unavailable"}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
window.CastSection = CastSection;
