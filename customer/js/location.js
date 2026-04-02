const CITY_STORAGE = "cinema_user_city";

const MOCK_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
];

/**
 * Reverse geocode via free Nominatim API (no key). Falls back to mock city.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string>}
 */
async function cityFromCoords(lat, lon) {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "json");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("zoom", "10");
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = await res.json();
    const addr = data.address || {};
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.state_district ||
      addr.county ||
      addr.state;
    if (city && typeof city === "string") return city;
  } catch {
    /* mock */
  }
  const idx = Math.abs(Math.floor(lat * 1000 + lon * 1000)) % MOCK_CITIES.length;
  return MOCK_CITIES[idx];
}

/**
 * Requests geolocation on load; stores city name for home screen.
 */
export function initLocation() {
  if (!("geolocation" in navigator)) {
    const fallback = MOCK_CITIES[0];
    sessionStorage.setItem(CITY_STORAGE, fallback);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const city = await cityFromCoords(
        pos.coords.latitude,
        pos.coords.longitude
      );
      sessionStorage.setItem(CITY_STORAGE, city);
    },
    () => {
      const fallback = MOCK_CITIES[2];
      sessionStorage.setItem(CITY_STORAGE, fallback);
    },
    { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 }
  );
}

export function getStoredCity() {
  return sessionStorage.getItem(CITY_STORAGE) || "Your city";
}
