# Palak Joshi · Architecture portfolio

A static, multi-page website: plain HTML, CSS and JavaScript, with no build step and no framework. It runs on GitHub Pages as is.

## Structure

```
index.html            Landing page: her name only; clicking it enters the site
home.html             Home (slideshow)
work.html             Project index (list / grid, filters, hover previews)
themes.html           Five themes, text only (no projects named, no images)
documentation.html    Field documentation
art.html              Atelier: drawings, paintings, studies and handmade models
about.html            Profile, portrait, education, skills, contact (#contact)
experience.html       Work experience and leadership
awards.html           Awards, competitions, workshops, registration
contact.html          Redirects to about.html#contact (keeps old links working)
404.html              Not-found page
projects/*.html       One page per project
assets/css/style.css  All styling (colours are the variables at the top)
assets/js/main.js     Slideshow, filters, lightbox, mobile menu
assets/img/<project>/ Images, one folder per project
_private/             Local only, ignored by git (CV source and PDF); in the private backup
```

## After editing the CSS or JavaScript

Every page loads `style.css?v=…` and `main.js?v=…`. Change that number on all pages whenever either file changes, otherwise returning visitors may see the old styling for a while (GitHub Pages lets browsers cache files for 10 minutes). From Git Bash in this folder:

```
V=$(date +%Y%m%d%H%M); sed -i -E "s#(style\.css|main\.js)\?v=[0-9]+#\1?v=$V#g" *.html projects/*.html
```

## Clean addresses

Links omit ".html" (for example `/work`, `/projects/haven`). GitHub Pages serves `work.html` at `/work` automatically. Keep new links in the same form, and use the same form in `sitemap.xml` and canonical URLs.

## Themes and articles

`themes.html` holds five short essays about the threads running through her work. They are deliberately text only and name no specific projects. Her own articles can be added later as a separate section; add it to the menu only when the first article is published, so the site never shows an empty page.

## Replacing images

Images are currently cropped from the PDF portfolio. To swap in originals, save the new file over the old one with the **same name** (for example `assets/img/haven/hero.jpg`). Export JPGs at about 2000 px on the long side, quality 80 to 85, so pages stay fast. If the proportions change, update the `width` and `height` on that `<img>` tag.

## Publishing on GitHub Pages

1. Sign in to GitHub as `palakjoshi5213` and create a **public** repository named exactly `palakjoshi5213.github.io`.
2. Upload everything in this folder to the repository (drag and drop on github.com, or push with git).
3. In the repository, open **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After a minute, the site is live at `https://palakjoshi5213.github.io`.

## Connecting a Namecheap domain

1. In GitHub, **Settings → Pages → Custom domain**: enter the domain (for example `palakjoshi.com`) and save.
2. In Namecheap, **Domain List → Manage → Advanced DNS**, add:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | palakjoshi5213.github.io. |

   Remove any default "parking page" records Namecheap added.
3. DNS can take up to a few hours. Then tick **Enforce HTTPS** in GitHub Pages settings.
4. Point the site's own links at the new domain (canonical URLs, link previews, sitemap, structured data). From Git Bash in this folder, replacing the example domain:

```
grep -rl "palakjoshi5213.github.io" --include=*.html --include=*.xml --include=*.txt . | xargs sed -i "s#https://palakjoshi5213.github.io#https://palakjoshi.com#g"
```

## Search engines and link previews

- `sitemap.xml` and `robots.txt` list the pages for Google. Add a new project page to `sitemap.xml` when you create one.
- Each page has link-preview tags (`og:` and `twitter:`), so links pasted into LinkedIn, WhatsApp or email show a title, description and image. The default image is `assets/img/og-image.jpg`; project pages use their own lead image.
- `index.html` and `about.html` carry structured data (JSON-LD) describing Ar. Palak Joshi for search engines. Update it if her role or firm changes.

## Backing up the whole folder

The public repository leaves out local-only files (original photos `IMG*.jpeg`, `.claude/`). A private repository, `palakjoshi5213/portfolio-backup`, holds a full snapshot of the folder. To refresh it, run this from Git Bash in this folder:

```
export GIT_INDEX_FILE="$(pwd)/.git/backup-index"; rm -f "$GIT_INDEX_FILE"
git read-tree HEAD && git add -f -A . && TREE=$(git write-tree)
unset GIT_INDEX_FILE; rm -f .git/backup-index
C=$(git commit-tree "$TREE" -p HEAD -m "Backup snapshot $(date '+%Y-%m-%d %H:%M')")
git push --force backup "$C:refs/heads/main"
```

The snapshot commit is never added to a local branch, so the private files cannot end up in the public repository by accident.

## The CV (private)

The CV is deliberately not on the website. Its source is `_private/cv.html`; the PDF lives in `_private/Palak-Joshi-CV.pdf`, which git ignores, so it never reaches the public repository (it is included in the private backup). To update it, edit `_private/cv.html`, open it in a browser, print to PDF (A4, no margins, background graphics on) and save it over `_private/Palak-Joshi-CV.pdf`. Send it directly to people who ask for it.
