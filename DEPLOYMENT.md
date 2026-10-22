# Publish Faroque Tech on GitHub Pages

## Fast path
1. Create a GitHub repository for the website.
2. Upload the contents of this ZIP (not the outer ZIP itself) to the repository root.
3. Confirm `index.html` appears at the repository root.
4. Go to **Settings → Pages**.
5. Choose **Deploy from a branch**, branch `main`, folder `/(root)`, and save.
6. Wait for GitHub Pages to publish. Copy the URL shown in Settings → Pages.

## Choosing the URL
- Account homepage: repository must be named `FaroqueTech0.github.io`; URL: `https://faroquetech0.github.io/`.
- Project site: any other repository name; URL: `https://faroquetech0.github.io/<repository-name>/`.

## Before publishing
- Confirm the repo and release links in `assets/projects.js`.
- Replace the Telegram placeholder link in `index.html`.
- Add genuine screenshots if available; current cards use CSS illustrations, not actual app screenshots.
- Review the descriptions and status labels for each project.
- Do not upload keystores, passwords, API tokens, or private signing credentials.

## Updating the site
Edit the relevant HTML/CSS/JS files, commit/push changes, and wait for Pages to redeploy.
