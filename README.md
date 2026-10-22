# Faroque Tech — Android Project Showcase

A responsive, dark-themed static website for showcasing Faroque Tech Android projects. Built with plain HTML, CSS, and JavaScript; no build system, package manager, or framework is required.

## Included
- Mobile-first responsive design
- Project search and category filters
- Project cards and individual pages for AOSPIsland, FingerFlux, and RootRealm
- Clearly marked project concepts for RootStream, FluxBoot, and FOS Manager
- GitHub release/source links where known
- Accessible navigation and reduced-motion support
- GitHub Pages deployment workflow

## Preview locally
Open `index.html` in a browser. For local server preview, from this folder run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a public GitHub repository, for example `faroque-tech`.
2. Upload all files and folders in this ZIP to the repository root. `index.html` must be at the root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/(root)`, then save.
6. Wait for the deployment to finish. GitHub will show the published URL in Settings → Pages.

If you want the site at `https://faroquetech0.github.io/`, the repository must be named exactly `FaroqueTech0.github.io` under that GitHub account. Otherwise, a normal project site URL will look like `https://FaroqueTech0.github.io/REPOSITORY/`.

### Optional custom domain
Configure the domain in Settings → Pages, then add the DNS records GitHub specifies for that domain. Do not add a CNAME file until you know the exact domain.

## Update project information

Edit `assets/projects.js`. Each project object supports:
- `name`, `category`, `categoryLabel`, `status`
- `short`, `details`, `features`, `requirements`, `tags`
- `version`, `release`, `repo`
- `symbol`, `accent`, `glow`

Only enter URLs that you have verified. Blank `release` or `repo` values are intentionally shown as unavailable instead of inventing links.

### Add a new project card
Add another object to `window.FAROQUE_PROJECTS` in `assets/projects.js`. For an individual detail page, create `apps/your-project-id.html`, using the existing project pages as a template. The card links to `apps/<id>.html`, so the filename must match the project's `id`.

## Update the Telegram link
In `index.html`, replace the `https://t.me/` placeholder with the actual public channel or group URL. The page intentionally marks this as a placeholder because the exact link has not been confirmed.

## Screenshots
The included artwork is CSS-generated and project marks are typographic placeholders, not screenshots from the actual apps. To add genuine screenshots:
1. Add files under `assets/images/`.
2. Update the corresponding project data or page HTML to reference the image.
3. Use screenshots you own or have permission to publish.

## Accuracy notes
- AOSPIsland, FingerFlux, and RootRealm use the known project/release URLs configured in this package.
- FOS Manager, RootStream, and FluxBoot are labeled as in-development/experimental concepts and do not link to an unverified download or repository.
- Check project releases and compatibility notes before installing any APK.
