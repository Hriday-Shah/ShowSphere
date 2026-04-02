/**
 * Mock backend: JSON files + optional localStorage overlay (admin writes).
 * Netlify-static compatible — no server required.
 */
const STORAGE_KEY = "cinema_booking_data_v1";

const FILE_MAP = {
  movies: "/data/movies.json",
  events: "/data/events.json",
  plays: "/data/plays.json",
  sports: "/data/sports.json",
  trending: "/data/trending.json",
};

export const CATEGORY_KEYS = ["movies", "events", "plays", "sports"];

/**
 * @returns {Promise<Record<string, unknown[]>>}
 */
export async function fetchFromFiles() {
  const entries = await Promise.all(
    Object.entries(FILE_MAP).map(async ([key, path]) => {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      const data = await res.json();
      return [key, data];
    })
  );
  return Object.fromEntries(entries);
}

/**
 * @returns {Promise<Record<string, unknown[]>>}
 */
export async function loadDataset() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      /* fall through */
    }
  }
  return fetchFromFiles();
}

/**
 * @param {Record<string, unknown[]>} data
 */
export function saveDataset(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearLocalDataset() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * @param {string} category
 * @returns {keyof typeof FILE_MAP | null}
 */
export function categoryToDataKey(category) {
  const map = {
    movies: "movies",
    events: "events",
    plays: "plays",
    sports: "sports",
  };
  return map[category] ?? null;
}
