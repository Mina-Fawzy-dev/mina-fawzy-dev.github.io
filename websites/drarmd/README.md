# دنتيفا — Dr. Arnsha Medhat · Website

Single-file website, ready for **GitHub Pages**. No build step, no dependencies to install —
`index.html` contains the HTML, CSS, JS, the logo (vector) and the doctor's photo (embedded WebP).

## Files

| File | Purpose |
|------|---------|
| `index.html` | the whole website — this is the page visitors see |
| `404.html` | branded "page not found" page (GitHub Pages uses it automatically) |
| `.nojekyll` | tells GitHub Pages to serve files as-is, without the Jekyll build step |
| `robots.txt` | allows search engines to index the site |
| `README.md` | this file (safe to delete, it is not served as a page) |

> Keep the name `index.html`. GitHub Pages only treats that name as the home page.

---

## Publish it (one time)

### Option A — upload in the browser (easiest, no tools)

1. Go to <https://github.com/new> and create a repository, e.g. `dentiva`.
   Choose **Public** (Pages needs Public on free accounts). Do **not** add a README.
2. On the new repo page click **uploading an existing file**.
3. Drag **the contents** of this folder into the page — `index.html`, `404.html`, `robots.txt`, `README.md`.
   `.nojekyll` starts with a dot, so drag it too if your file manager shows hidden files
   (Windows: **View → Show → Hidden items**). Without it the site still works.

   > Upload the files, **not** the whole folder as-is — the hidden `.git` folder inside it is
   > version-control data and must not be uploaded.4. Click **Commit changes**.
5. Go to **Settings → Pages**, and under *Build and deployment* set
   **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**, then **Save**.
6. Wait 1–2 minutes. The site is live at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

   e.g. `https://mina-fawzy-dev.github.io/dentiva/`

### Option B — Git (this folder is already a git repository)

```bash
cd "E:\websites\dental-clinic\github-pages"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then do step 5 above (Settings → Pages).

---

## Updating the site later

Edit `index.html` (or replace it), then either re-upload it in GitHub, or:

```bash
cd "E:\websites\dental-clinic\github-pages"
git add -A
git commit -m "update"
git push
```

GitHub Pages redeploys in about a minute. Changes are not instant — check for the
"pages build and deployment" run under the **Actions** tab.

---

## Notes

* The site is 100% self-contained: opening `index.html` by double-click works offline, and
  `file://` is fine for everything except the Google Map (it needs a real domain).
* External requests are only: Google Fonts (Cairo), Phosphor icon font, Simple Icons
  (Instagram / TikTok / Facebook), and the Google Maps embed. All of them work over HTTPS on Pages.
* Custom domain (e.g. `dentiva.com`)? **Settings → Pages → Custom domain** — then add a `CNAME`
  file with that domain, and point a `CNAME` DNS record at `<your-username>.github.io`.
* Do not rename the `main` branch after publishing, or update the Pages settings to match.
