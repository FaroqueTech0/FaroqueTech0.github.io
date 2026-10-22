(() => {
  const projects = Array.isArray(window.FAROQUE_PROJECTS) ? window.FAROQUE_PROJECTS : [];
  const grid = document.getElementById("projectGrid");
  const search = document.getElementById("projectSearch");
  const filters = document.getElementById("filters");
  const empty = document.getElementById("emptyState");
  let activeFilter = "all";

  const safeUrl = (url) => {
    try { const parsed = new URL(url); return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : ""; }
    catch (_) { return ""; }
  };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const link = (url, label, secondary = false) => {
    const valid = safeUrl(url);
    if (!valid) return `<span class="card-link secondary" title="Public link not configured">${label} unavailable</span>`;
    return `<a class="card-link ${secondary ? "secondary" : ""}" href="${escapeHtml(valid)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  };

  function card(project) {
    const tags = (project.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const release = safeUrl(project.release);
    const details = `apps/${encodeURIComponent(project.id)}.html`;
    return `<article class="project-card">
      <div class="project-cover" style="--cover-accent:${escapeHtml(project.accent || "#71ead4")};--cover-glow:${escapeHtml(project.glow || "#254d4a")}">
        <div class="project-logo">${escapeHtml(project.symbol || project.name.slice(0,2))}</div>
        <span class="cover-label">FAROQUE TECH</span>
      </div>
      <div class="project-body">
        <div class="project-topline"><span class="project-category">${escapeHtml(project.categoryLabel || project.category)}</span><span class="project-status">${escapeHtml(project.status || "Project")}</span></div>
        <h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.short)}</p>
        <div class="tag-row">${tags}</div>
        <div class="card-actions"><a class="card-link" href="${details}">Project details →</a>${release ? link(release, "Download") : link(project.repo, "Source", true)}</div>
      </div>
    </article>`;
  }

  function render() {
    const query = (search.value || "").trim().toLowerCase();
    const shown = projects.filter(project => {
      const matchesFilter = activeFilter === "all" || project.category === activeFilter;
      const haystack = [project.name, project.short, project.categoryLabel, ...(project.tags || [])].join(" ").toLowerCase();
      return matchesFilter && haystack.includes(query);
    });
    grid.innerHTML = shown.map(card).join("");
    empty.hidden = shown.length !== 0;
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
    render();
  });
  search.addEventListener("input", render);

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      nav.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  const params = new URLSearchParams(location.search);
  const selected = params.get("project");
  if (selected) {
    const target = document.getElementById("apps");
    if (target) target.scrollIntoView();
    search.value = selected;
  }
  render();
})();
