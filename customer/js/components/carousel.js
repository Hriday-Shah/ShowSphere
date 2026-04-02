/**
 * Full-width carousel with auto-slide, dots, and touch swipe.
 * @param {HTMLElement} root
 * @param {{ images: string[]; titles?: string[]; intervalMs?: number }} options
 */
export function mountCarousel(root, options) {
  const { images, titles = [], intervalMs = 5000 } = options;
  if (!images.length) {
    root.innerHTML = '<p class="carousel__empty">No trending items.</p>';
    return () => {};
  }

  const n = images.length;
  let index = 0;
  let timer = null;

  const track = document.createElement("div");
  track.className = "carousel__track";

  images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel__slide";
    slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");

    const img = document.createElement("img");
    img.src = src;
    img.alt = titles[i] || `Slide ${i + 1}`;
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    slide.appendChild(img);

    const cap = document.createElement("div");
    cap.className = "carousel__caption";
    if (titles[i]) {
      const h = document.createElement("h2");
      h.textContent = titles[i];
      cap.appendChild(h);
    }
    slide.appendChild(cap);

    track.appendChild(slide);
  });

  root.style.setProperty("--carousel-slides", String(n));
  root.setAttribute("role", "region");
  root.setAttribute("aria-roledescription", "carousel");
  root.setAttribute("aria-label", "Trending");

  const slides = () => track.querySelectorAll(".carousel__slide");

  function goTo(next) {
    index = (next + n) % n;
    track.style.transform = `translateX(-${(index * 100) / n}%)`;
    slides().forEach((el, i) => {
      el.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    root.querySelectorAll(".carousel__dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
    });
  }

  const dots = document.createElement("div");
  dots.className = "carousel__dots";
  dots.setAttribute("role", "tablist");

  images.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel__dot" + (i === 0 ? " is-active" : "");
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => goTo(i));
    dots.appendChild(b);
  });

  root.innerHTML = "";
  root.appendChild(track);
  root.appendChild(dots);

  function next() {
    goTo(index + 1);
  }

  function start() {
    stop();
    timer = window.setInterval(next, intervalMs);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  let touchStartX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stop();
    },
    { passive: true }
  );
  track.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (dx > 50) goTo(index - 1);
      else if (dx < -50) goTo(index + 1);
      start();
    },
    { passive: true }
  );

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  start();

  return () => {
    stop();
  };
}
