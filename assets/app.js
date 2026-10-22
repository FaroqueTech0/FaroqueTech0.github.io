(() => {
  "use strict";

  const OWNER = "FaroqueTech0";
  const ALWAYS_VISIBLE_REPOS = new Set(["aospisland", "fingerflux", "rootrealm"]);
  const HIDDEN_REPOS = new Set(["faroquetech0.github.io", "how-to-become-me"]);
  const API_URL = `https://api.github.com/users/${OWNER}/repos?type=public&sort=updated&per_page=100`;
  const projects = Array.isArray(window.FAROQUE_PROJECTS) ? window.FAROQUE_PROJECTS : [];
  const grid = document.getElementById("projectGrid");
  const search = document.getElementById("projectSearch");
  const filters = document.getElementById("filters");
  const empty = document.getElementById("emptyState");
  let activeFilter = "all";
  let allProjects = [...projects];

  if (!grid || !search || !filters || !empty) {
    console.error("Faroque Tech: required project showcase elements were not found.");
    return;
  }

  const safeUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : "";
    } catch (_) {
      return "";
    }
  };

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  const slugify = (value) =>
    String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();

  const link = (url, label, secondary = false) => {
    const valid = safeUrl(url);
    if (!valid) {
      return `<span class="card-link secondary" title="Public link not configured">${label} unavailable</span>`;
    }
    return `<a class="card-link ${secondary ? "secondary" : ""}" href="${escapeHtml(valid)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  };

  function card(project) {
    const tags = (project.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const release = safeUrl(project.release);
    const repo = safeUrl(project.repo);
    const details = project.autoDiscovered && safeUrl(project.repo)
      ? safeUrl(project.repo)
      : `apps/${encodeURIComponent(project.id)}.html`;

    return `<article class="project-card">
      <div class="project-cover" style="--cover-accent:${escapeHtml(project.accent || "#71ead4")};--cover-glow:${escapeHtml(project.glow || "#254d4a")}">
        <div class="project-logo">${escapeHtml(project.symbol || String(project.name || "FT").slice(0, 2))}</div>
        <span class="cover-label">FAROQUE TECH</span>
      </div>
      <div class="project-body">
        <div class="project-topline"><span class="project-category">${escapeHtml(project.categoryLabel || project.category || "Android projects")}</span><span class="project-status">${escapeHtml(project.status || "Project")}</span></div>
        <h3>${escapeHtml(project.name || "Untitled project")}</h3><p>${escapeHtml(project.short || project.description || "An Android project by Faroque Tech.")}</p>
        <div class="tag-row">${tags}</div>
        <div class="card-actions"><a class="card-link" href="${details}"${project.autoDiscovered ? ' target="_blank" rel="noopener noreferrer"' : ""}>${project.autoDiscovered ? "View repository ↗" : "Project details →"}</a>${release ? link(release, "Download") : link(repo, "Source", true)}</div>
      </div>
    </article>`;
  }

  function render() {
    const query = (search.value || "").trim().toLowerCase();
    const shown = allProjects.filter(project => {
      const matchesFilter = activeFilter === "all" ||
        project.category === activeFilter ||
        (activeFilter === "development" && project.statusType === "development") ||
        (activeFilter === "experimental" && project.statusType === "experimental");
      const haystack = [
        project.name, project.short, project.description, project.categoryLabel,
        ...(project.tags || [])
      ].join(" ").toLowerCase();
      return matchesFilter && haystack.includes(query);
    });

    grid.innerHTML = shown.map(card).join("");
    empty.hidden = shown.length !== 0;
  }

  function repoToProject(repo) {
    const name = repo.name || "GitHub project";
    const description = repo.description || `Public repository by ${OWNER}.`;
    const isArchived = Boolean(repo.archived);
    const isReleased = Boolean(repo.latest_release && repo.latest_release.html_url);

    return {
      id: `github-${slugify(repo.name) || repo.id}`,
      name,
      category: "github",
      categoryLabel: "GitHub repository",
      status: isArchived ? "Archived" : (isReleased ? "Release available" : "GitHub project"),
      symbol: String(name).replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "GH",
      accent: "#8bd8c7",
      glow: "#254d4a",
      short: description,
      tags: ["GitHub", ...(repo.language ? [repo.language] : []), ...(repo.topics || []).slice(0, 2)],
      version: repo.latest_release?.tag_name || "Repository",
      release: isReleased ? repo.latest_release.html_url : "",
      repo: repo.html_url,
      detailsUrl: repo.html_url,
      detailsLabel: "View repository",
      statusType: isArchived ? "archived" : (isReleased ? "released" : "development"),
      autoDiscovered: true
    };
  }

  async function fetchLatestRelease(repo) {
    try {
      const response = await fetch(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo.name)}/releases/latest`, {
        headers: { "Accept": "application/vnd.github+json" }
      });
      if (!response.ok) return null;
      const release = await response.json();
      return { html_url: release.html_url, tag_name: release.tag_name };
    } catch (_) {
      return null;
    }
  }

  async function discoverRepositories() {
    try {
      const response = await fetch(API_URL, {
        headers: { "Accept": "application/vnd.github+json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

      const repos = await response.json();
      if (!Array.isArray(repos)) throw new Error("Unexpected GitHub API response");

      // Always show the three featured apps. Hide other repositories until they have a public release.
      const visibleRepos = repos.filter(repo => {
        const name = String(repo.name || "").toLowerCase();
        return !HIDDEN_REPOS.has(name) &&
          (ALWAYS_VISIBLE_REPOS.has(name) || !repo.archived);
      });

      const curatedByRepo = new Map();
      projects.forEach(project => {
        const repoName = (project.repo || "").split("/").filter(Boolean).pop();
        if (repoName) curatedByRepo.set(slugify(repoName), project);
      });

      const discovered = await Promise.all(visibleRepos.map(async repo => {
        const name = String(repo.name || "").toLowerCase();
        const curated = curatedByRepo.get(slugify(repo.name));
        const release = await fetchLatestRelease(repo);

        // Always retain the three featured apps, even if their latest-release endpoint is empty.
        if (ALWAYS_VISIBLE_REPOS.has(name)) {
          if (curated) {
            const copy = { ...curated };
            if (!safeUrl(copy.repo) && safeUrl(repo.html_url)) copy.repo = repo.html_url;
            if (!safeUrl(copy.release) && release) copy.release = release.html_url;
            return copy;
          }
          return repoToProject({ ...repo, latest_release: release });
        }

        // New repositories appear only after a public release exists.
        if (!release) return null;

        if (curated) {
          const copy = { ...curated };
          if (!safeUrl(copy.repo) && safeUrl(repo.html_url)) copy.repo = repo.html_url;
          if (!safeUrl(copy.release)) copy.release = release.html_url;
          return copy;
        }

        return repoToProject({ ...repo, latest_release: release });
      }));

      // Keep curated projects even when a matching public repository isn't found.
      const published = discovered.filter(Boolean);
      const discoveredIds = new Set(published.map(project => project.id));
      const extras = projects.filter(project => !discoveredIds.has(project.id) && ALWAYS_VISIBLE_REPOS.has(slugify(project.name)));
      allProjects = [...published, ...extras];
      render();
      console.info(`Faroque Tech: loaded ${allProjects.length} projects (${repos.length} public repositories checked).`);
    } catch (error) {
      // The curated catalogue remains usable if GitHub is offline or rate-limited.
      console.warn("Faroque Tech: automatic GitHub discovery failed; showing curated projects.", error);
      allProjects = [...projects];
      render();
    }
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter || "all";
    filters.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
    render();
  });

  search.addEventListener("input", render);

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");
  if (menuToggle && nav) {
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
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const params = new URLSearchParams(location.search);
  const selected = params.get("project");
  if (selected) {
    const target = document.getElementById("apps");
    if (target) target.scrollIntoView();
    search.value = selected;
  }

  render();
  discoverRepositories();
})();
