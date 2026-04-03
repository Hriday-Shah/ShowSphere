import { loadDataset, categoryToDataKey } from "../../shared/js/dataService.js";
import { initLocation, getStoredCity } from "./location.js";
import { mountCarousel } from "./components/carousel.js";

const FILTER_STATE = {
  language: new Set(),
  genre: new Set(),
  age_rating: new Set(),
};

let dataset = null;
let activeCategory = "movies";
let carouselCleanup = () => {};

function uniqueValues(items, key) {
  const s = new Set();
  items.forEach((item) => {
    const v = item[key];
    if (v != null && String(v).trim()) s.add(String(v));
  });
  return [...s].sort();
}

function passesFilters(item) {
  if (
    FILTER_STATE.language.size &&
    !FILTER_STATE.language.has(item.language)
  )
    return false;
  if (FILTER_STATE.genre.size && !FILTER_STATE.genre.has(item.genre))
    return false;
  if (
    FILTER_STATE.age_rating.size &&
    !FILTER_STATE.age_rating.has(item.age_rating)
  )
    return false;
  return true;
}

function renderFilters(items) {
  const langEl = document.getElementById("filter-language");
  const genreEl = document.getElementById("filter-genre");
  const ageEl = document.getElementById("filter-age");
  if (!langEl || !genreEl || !ageEl) return;

  const langs = uniqueValues(items, "language");
  const genres = uniqueValues(items, "genre");
  const ages = uniqueValues(items, "age_rating");

  function buildGroup(container, values, stateSet, name) {
    container.innerHTML = "";
    values.forEach((val) => {
      const id = `${name}-${val.replace(/\s+/g, "-")}`;
      const wrap = document.createElement("label");
      wrap.className = "filter-chip";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = name;
      input.value = val;
      input.id = id;
      input.checked = stateSet.has(val);
      input.addEventListener("change", () => {
        if (input.checked) stateSet.add(val);
        else stateSet.delete(val);
        renderGrid();
      });
      const span = document.createElement("span");
      span.textContent = val;
      wrap.appendChild(input);
      wrap.appendChild(span);
      container.appendChild(wrap);
    });
  }

  buildGroup(langEl, langs, FILTER_STATE.language, "lang");
  buildGroup(genreEl, genres, FILTER_STATE.genre, "genre");
  buildGroup(ageEl, ages, FILTER_STATE.age_rating, "age");
}

function renderGrid() {
  const grid = document.getElementById("content-grid");
  if (!grid || !dataset) return;

  const key = categoryToDataKey(activeCategory);
  const items = key ? dataset[key] || [] : [];
  const filtered = items.filter(passesFilters);

  grid.innerHTML = "";
  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "show-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.id = item.id;

    const imgWrap = document.createElement("div");
    imgWrap.className = "show-card__poster";
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "";
    img.loading = "lazy";
    imgWrap.appendChild(img);

    const meta = document.createElement("div");
    meta.className = "show-card__meta";
    const title = document.createElement("h3");
    title.className = "show-card__title";
    title.textContent = item.title;
    const row = document.createElement("div");
    row.className = "show-card__row";
    const age = document.createElement("span");
    age.className = "badge badge--age";
    age.textContent = item.age_rating;
    const lang = document.createElement("span");
    lang.className = "show-card__lang";
    lang.textContent = item.language;
    row.appendChild(age);
    row.appendChild(lang);
    meta.appendChild(title);
    meta.appendChild(row);

    card.appendChild(imgWrap);
    card.appendChild(meta);

    const openBooking = () => {
      const params = new URLSearchParams({
        type: activeCategory,
        id: item.id,
      });
      window.location.href = `booking.html?${params.toString()}`;
    };
    card.addEventListener("click", openBooking);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openBooking();
      }
    });

    grid.appendChild(card);
  });
  applySearchFilter();
}

function setCategory(cat) {
  activeCategory = cat;
  FILTER_STATE.language.clear();
  FILTER_STATE.genre.clear();
  FILTER_STATE.age_rating.clear();

  document.querySelectorAll("[data-category-tab]").forEach((btn) => {
    const isActive = btn.dataset.categoryTab === cat;
    btn.classList.toggle("ribbon__tab--active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  const key = categoryToDataKey(cat);
  const items = key && dataset ? dataset[key] || [] : [];
  renderFilters(items);
  renderGrid();
}

function initRibbon() {
  document.querySelectorAll("[data-category-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setCategory(btn.dataset.categoryTab);
    });
  });
}

function applySearchFilter() {
  const input = document.getElementById("header-search");
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  document.querySelectorAll(".show-card").forEach((card) => {
    const title = card.querySelector(".show-card__title");
    const text = title ? title.textContent.toLowerCase() : "";
    card.hidden = q.length > 0 && !text.includes(q);
  });
}

function initSearch() {
  const input = document.getElementById("header-search");
  if (!input) return;
  input.addEventListener("input", applySearchFilter);
}

function initFiltersToggle() {
  const btn = document.getElementById("filters-toggle");
  const panel = document.getElementById("filter-panel");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const open = panel.classList.toggle("filter-panel--open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function initCollapsibleSections() {
  document.querySelectorAll("[data-accordion]").forEach((section) => {
    const trigger = section.querySelector("[data-accordion-trigger]");
    const body = section.querySelector("[data-accordion-body]");
    if (!trigger || !body) return;
    trigger.addEventListener("click", () => {
      const open = section.classList.toggle("accordion--open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
}

function updateLocationDisplay() {
  const el = document.getElementById("header-location");
  if (el) el.textContent = getStoredCity();
}

async function initTrendingCarousel() {
  const host = document.getElementById("trending-carousel");
  if (!host || !dataset?.trending) return;

  carouselCleanup();
  const trending = dataset.trending.slice(0, 3);
  carouselCleanup = mountCarousel(host, {
    images: trending.map((t) => t.image),
    titles: trending.map((t) => t.title),
    intervalMs: 5500,
  });
}

export async function initHome() {
  if (sessionStorage.getItem("cinema_customer_session") !== "1") {
    window.location.replace("login.html");
    return;
  }

  initLocation();
  dataset = await loadDataset();
  updateLocationDisplay();
  setInterval(updateLocationDisplay, 2000);

  await initTrendingCarousel();
  initRibbon();
  setCategory("movies");
  initSearch();
  initFiltersToggle();
  initCollapsibleSections();
}
