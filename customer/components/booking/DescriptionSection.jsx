const DescriptionSection = ({ description }) => {
  return (
    <section className="booking-section" aria-label="Description">
      <h2 className="section-title">About this show</h2>
      <p className="booking-description">{description || "Description not available"}</p>
    </section>
  );
};
window.DescriptionSection = DescriptionSection;
