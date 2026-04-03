window.bookingDataService = (function () {
  const STORAGE_KEY = "cinema_booking_data_v1";
  const FILES = ["movies", "events", "plays", "sports", "trending", "booking-config"];

  async function fetchWithFallback(path) {
    const tryPaths = [path, `..${path}`];
    let lastErr;
    for (const p of tryPaths) {
      try {
        const res = await fetch(p);
        if (res.ok) return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error(`Failed to load ${path}`);
  }

  async function loadDataset() {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const cfg = await fetchWithFallback("/data/booking-config.json");
        parsed["booking-config"] = cfg;
        return parsed;
      } catch {}
    }

    const entries = await Promise.all(
      FILES.map(async (k) => [k, await fetchWithFallback(`/data/${k}.json`)])
    );
    return Object.fromEntries(entries);
  }

  function getCity() {
    return sessionStorage.getItem("cinema_user_city") || "Your city";
  }

  return { loadDataset, getCity };
})();
