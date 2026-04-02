if (sessionStorage.getItem("cinema_customer_session") !== "1") {
  window.location.replace("index.html");
} else {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") || "—";
  const id = params.get("id") || "—";
  const el = document.getElementById("booking-query");
  if (el) el.textContent = `type=${type} · id=${id}`;
}
