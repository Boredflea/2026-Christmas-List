(() => {
  const items = [
    {
      id: "cutters",
      rank: "01",
      tier: "want",
      tierLabel: "Things I Actually Want",
      title: "iFixit Flush Cutters",
      quote: "Because my old ones are dented and dull, and I still need to brute-force things until they're flush.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Compound_action_wire_cutters.jpg/1280px-Compound_action_wire_cutters.jpg",
      alt: "Compound-action wire cutters on a plain background",
      demand: 96,
      verdict: "Non-Negotiable",
      dossier: "A precision instrument for the violently patient. Built for the sacred act of making things flush after all subtlety has left the room.",
      tags: ["Precision", "Brute Force", "Replaces Dull Ones"],
      feature: true
    },
    {
      id: "sanding",
      rank: "02",
      tier: "want",
      tierLabel: "Things I Actually Want",
      title: "Small Sanding Sticks of Various Grits",
      quote: "Sounds useful, and like cancer, which is why I would only use them outside. Or vacuum right after.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Schleifpapier_verschiedene_Sorten.jpg/1280px-Schleifpapier_verschiedene_Sorten.jpg",
      alt: "Sandpaper sheets in several different grits",
      demand: 80,
      verdict: "Practical, Apparently",
      dossier: "A compact arsenal of abrasion. Ideal for corners, edges, small projects, and creating a fine layer of existential dust.",
      tags: ["Various Grits", "Outdoor Use", "Vacuum After"],
      feature: false
    },
    {
      id: "keyboard",
      rank: "03",
      tier: "nice",
      tierLabel: "Things That Would Be Nice To Have",
      title: "Mechanical Keyboard",
      quote: "Clackity Clack Clack. Actually, no. I want a quieter one.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Beautiful_Mechanical_Keyboard.jpg/1280px-Beautiful_Mechanical_Keyboard.jpg",
      alt: "Black and white mechanical keyboard with custom keycaps",
      demand: 100,
      verdict: "Quietly Essential",
      dossier: "The tactile prestige of a mechanical keyboard with the acoustics of a polite librarian. A contradiction, somehow resolved in aluminum.",
      tags: ["Quiet Switches", "No Clack", "Tactile"],
      feature: false
    },
    {
      id: "gold",
      rank: "04",
      tier: "complain",
      tierLabel: "I Wouldn't Complain",
      title: "Real Gold, No Plastic",
      quote: "OOOOOHHHHH SHINY",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Gold_Ingots_on_white_background.jpg/1280px-Gold_Ingots_on_white_background.jpg",
      alt: "Gold ingots arranged together",
      demand: 88,
      verdict: "Object of Worship",
      dossier: "Precious. Dense. Unreasonably reflective. A gift that says nothing subtle and everything about a deep appreciation for shiny metal.",
      tags: ["Real", "No Plastic", "Shiny"],
      feature: false
    },
    {
      id: "sword",
      rank: "05",
      tier: "complain",
      tierLabel: "I Wouldn't Complain",
      title: "Life-Sized Steel Longsword Replica + Wall Mount",
      leaderboardTitle: "Longsword",
      quote: "Yeah, worth a shot.",
      image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Albion_Kern_Medieval_Sword_08_%287312957284%29.jpg/1280px-Albion_Kern_Medieval_Sword_08_%287312957284%29.jpg",
      alt: "Steel medieval sword replica photographed vertically",
      demand: 93,
      verdict: "Absolutely Worth A Shot",
      dossier: "A full-size steel longsword replica for the home. Dramatic, historical, extremely noted, and not remotely subtle in a hallway.",
      tags: ["Steel", "Life-Sized", "Hero Energy"],
      feature: true
    }
  ];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const catalog = document.getElementById("catalog");
  const podium = document.getElementById("podium");
  const empty = document.getElementById("empty");
  const search = document.getElementById("search");
  const filters = document.querySelector(".filters");
  const dossier = document.getElementById("dossier");
  const dossierContent = document.getElementById("dossierContent");
  const counterUnits = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" })
    : null;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cardTemplate(item, index) {
    return `
      <article class="item-card ${item.feature ? "item-card--wide" : ""} reveal" data-id="${escapeHtml(item.id)}" style="--delay:${index * 70}ms; --level:${item.demand}%">
        <div class="item-card__media">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy">
          <span class="item-card__rank">${escapeHtml(item.rank)}</span>
          <span class="item-card__tier">${escapeHtml(item.tierLabel)}</span>
        </div>
        <div class="item-card__body">
          <p class="item-card__kicker">${escapeHtml(item.verdict)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <blockquote>“${escapeHtml(item.quote)}”</blockquote>
          <div class="meter" role="img" aria-label="Demand level ${item.demand} percent"><span></span></div>
          <div class="meter__meta"><span>Demand Level</span><strong>${item.demand}%</strong></div>
          <div class="tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          <div class="item-card__actions">
            <button class="link-btn" type="button" data-action="dossier" data-id="${escapeHtml(item.id)}">Open dossier</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCatalog() {
    const active = document.querySelector(".filter.is-active")?.dataset.filter || "all";
    const query = search.value.trim().toLowerCase();
    const visible = items.filter((item) => {
      const matchesTier = active === "all" || item.tier === active;
      const haystack = `${item.title} ${item.quote} ${item.tierLabel} ${item.tags.join(" ")}`.toLowerCase();
      return matchesTier && haystack.includes(query);
    });

    catalog.innerHTML = visible.map(cardTemplate).join("");
    empty.hidden = visible.length > 0;
    observeReveals(catalog);
    bindCardTilt();
  }

  function renderPodium() {
    const ranked = [...items].sort((a, b) => b.demand - a.demand).slice(0, 3);
    const places = ["First", "Second", "Third"];
    const numbers = ["01", "02", "03"];

    podium.innerHTML = ranked.map((item, index) => `
      <button class="podium__step podium__step--${places[index].toLowerCase()} reveal" type="button" data-action="dossier" data-id="${escapeHtml(item.id)}" style="--delay:${index * 90}ms">
        <span class="podium__place">${numbers[index]}</span>
        <img src="${escapeHtml(item.image)}" alt="" loading="lazy">
        <span class="podium__info">
          <span class="podium__tier">${escapeHtml(item.tierLabel)}</span>
          <h3>${escapeHtml(item.leaderboardTitle || item.title)}</h3>
        </span>
        <strong>${item.demand}<small>%</small></strong>
      </button>
    `).join("");

    observeReveals(podium);
  }

  function observeReveals(root) {
    root.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
      if (revealObserver) {
        revealObserver.observe(element);
      } else {
        element.classList.add("is-visible");
      }
    });
  }

  function bindCardTilt() {
    catalog.querySelectorAll(".item-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (reduceMotion.matches) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--ry", `${x * 5}deg`);
        card.style.setProperty("--rx", `${-y * 5}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  function openDossier(id) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    dossierContent.innerHTML = `
      <div class="dossier__media">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}">
      </div>
      <div class="dossier__body">
        <p class="eyebrow">${escapeHtml(item.rank)} · ${escapeHtml(item.tierLabel)}</p>
        <h2 id="dossierTitle">${escapeHtml(item.title)}</h2>
        <blockquote>“${escapeHtml(item.quote)}”</blockquote>
        <p>${escapeHtml(item.dossier)}</p>
        <div class="dossier__facts">
          <div><span>Verdict</span><strong>${escapeHtml(item.verdict)}</strong></div>
          <div><span>Demand Level</span><strong>${item.demand}%</strong></div>
          <div><span>Tier</span><strong>${escapeHtml(item.tierLabel)}</strong></div>
          <div><span>List Position</span><strong>No. ${escapeHtml(item.rank)}</strong></div>
        </div>
      </div>
    `;

    if (!dossier.open) dossier.showModal();
    document.body.classList.add("modal-open");
    dossier.querySelector(".dossier__close")?.focus();
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  async function copyList(button) {
    const text = items.map((item, index) => `${index + 1}. ${item.title} — ${item.quote}`).join("\n\n");
    const original = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    button.textContent = "List copied";
    setTimeout(() => { button.textContent = original; }, 1800);
  }

  function startCountdown() {
    const target = new Date("2026-12-25T00:00:00").getTime();

    function tick() {
      const remaining = target - Date.now();
      if (remaining <= 0) {
        Object.values(counterUnits).forEach((unit) => { unit.textContent = "00"; });
        return;
      }

      const totalSeconds = Math.floor(remaining / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const values = { days, hours, minutes, seconds };

      Object.entries(counterUnits).forEach(([key, unit]) => {
        unit.textContent = String(values[key]).padStart(2, "0");
      });
    }

    tick();
    setInterval(tick, 1000);
  }

  function animateStats() {
    document.querySelectorAll("[data-count]").forEach((element) => {
      const end = Number(element.dataset.count) || 0;
      const suffix = element.dataset.suffix || "";
      if (reduceMotion.matches) {
        element.textContent = `${end}${suffix}`;
        return;
      }

      const start = performance.now();
      const duration = 1400;

      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(end * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    });
  }

  function setupScrollProgress() {
    const bar = document.querySelector(".scroll-progress span");
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function setupCursor() {
    window.addEventListener("pointermove", (event) => {
      document.body.style.setProperty("--mx", `${event.clientX}px`);
      document.body.style.setProperty("--my", `${event.clientY}px`);
    }, { passive: true });
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest(".filter");
    if (!button) return;

    filters.querySelectorAll(".filter").forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });

    renderCatalog();
  });

  search.addEventListener("input", renderCatalog);

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || button.dataset.action !== "dossier") return;
    openDossier(button.dataset.id);
  });

  document.querySelector("[data-close-dossier]").addEventListener("click", () => dossier.close());

  dossier.addEventListener("click", (event) => {
    if (event.target === dossier) dossier.close();
  });

  dossier.addEventListener("close", () => document.body.classList.remove("modal-open"));

  document.getElementById("copyList").addEventListener("click", (event) => copyList(event.currentTarget));
  document.getElementById("finalCopy").addEventListener("click", (event) => copyList(event.currentTarget));
  document.getElementById("printList").addEventListener("click", () => window.print());

  renderCatalog();
  renderPodium();
  observeReveals(document);
  animateStats();
  startCountdown();
  setupScrollProgress();
  setupCursor();
})();
