# Palak Joshi · Architecture portfolio

A static, multi-page website: plain HTML, CSS and JavaScript, with no build step and no framework. It runs on GitHub Pages as is.

## Structure

```
index.html            Home (slideshow)
work.html             Project index (list / grid, filters, hover previews)
themes.html           Three themes with short essays
documentation.html    Field documentation
art.html              Sketches, paintings, models
about.html            Profile, education, skills
experience.html       Work experience and leadership
awards.html           Awards, competitions, workshops, registration
contact.html          Contact details
404.html              Not-found page
projects/*.html       One page per project
assets/css/style.css  All styling (colours are the variables at the top)
assets/js/main.js     Slideshow, filters, lightbox, mobile menu
assets/img/<project>/ Images, one folder per project
assets/docs/          Downloadable CV (PDF)
_source/              Working files, not published (cv.html is the source of the CV PDF)
```

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

## Updating the CV

Edit `_source/cv.html`, open it in a browser, print to PDF (A4, no margins, background graphics on), and save it over `assets/docs/Palak-Joshi-CV.pdf`.
