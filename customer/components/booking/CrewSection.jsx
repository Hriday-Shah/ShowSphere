const CrewSection = ({ crew, fallbackImage }) => {
  if (!crew || !crew.length) return null;
  return (
    <section className="booking-section" aria-label="Crew">
      <h2 className="section-title">Crew</h2>
      <div className="people-grid">
        {crew.map((member, idx) => (
          <article className="person-card" key={`crew-${idx}`}>
            <img src={member.photo || fallbackImage} alt={member.name || "Crew member"} className="person-avatar" loading="lazy" />
            <p className="person-name">{member.name || "Name unavailable"}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
window.CrewSection = CrewSection;
