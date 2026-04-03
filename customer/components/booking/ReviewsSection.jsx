const ReviewsSection = ({ reviews }) => {
  const list = reviews && reviews.length ? reviews : [{ name: "Guest", rating: 0, text: "No reviews yet." }];
  const stars = (rating) => "?????".slice(0, rating) + "?????".slice(0, 5 - rating);

  return (
    <section className="booking-section" aria-label="Reviews">
      <h2 className="section-title">Reviews</h2>
      <div className="reviews-list">
        {list.map((review, idx) => (
          <article className="review-card" key={`review-${idx}`}>
            <div className="review-head">
              <strong>{review.name || "Anonymous"}</strong>
              <span className="review-stars" aria-label={`Rating ${review.rating || 0} out of 5`}>
                {stars(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
              </span>
            </div>
            <p>{review.text || "No review text"}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
window.ReviewsSection = ReviewsSection;
