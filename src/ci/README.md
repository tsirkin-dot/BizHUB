# CI workflow

`build.yml` belongs at `.github/workflows/build.yml`. It is kept here because GitHub
blocks remote tools from writing into `.github/workflows/`, which is a deliberate guard
against an automated agent granting itself CI permissions.

Move it once, by hand:

```powershell
mkdir .github\workflows
move src\ci\build.yml .github\workflows\build.yml
```

What it does on every push to `main`: builds the site with pretty URLs, runs
`src/verify.mjs` over the result, fails if the committed HTML has drifted from `src/`,
and deploys to GitHub Pages.

Pages has to be switched to **GitHub Actions** as its source in
Settings → Pages before the deploy step can succeed.
