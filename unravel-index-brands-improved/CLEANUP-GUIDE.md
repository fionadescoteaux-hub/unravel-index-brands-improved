# Cleaning up the GitHub repository — once, properly

The repo has accumulated weeks of partial uploads: old file versions, files
GitHub's uploader renamed by stripping hyphens (`getportfolio.js` instead of
`get-portfolio.js`), and leftovers from earlier zips. Rather than deleting
files one by one through the web interface, do a clean slate. Ten minutes.

## The clean-slate route (recommended)

1. **Make a fresh repository.** github.com → the **+** menu (top right) →
   *New repository* → name it `unravel-index-brands-v3` → Private → Create.
   Do NOT tick any "initialise with…" boxes.
2. **Upload this tree once.** On the new repo's page choose
   *uploading an existing file*. Unzip the delivery zip on your computer,
   open the unzipped folder, select **everything inside it** (the folders
   `data`, `docs`, `lib`, `netlify`, `public`, `scripts`, `tests` and the
   files `README.md`, `CHANGELOG.md`, `IMPLEMENTATION-ASSESSMENT.md`,
   `MIGRATION.md`, `CLEANUP-GUIDE.md`, `netlify.toml`, `package.json`) and
   drag them all into the upload area together — dragging folders keeps the
   structure. Commit.
3. **Point Netlify at the new repo.** app.netlify.com → the
   `unravel-index-brands` site → *Site configuration* → *Build & deploy* →
   *Link repository* → choose the new repo, branch `main`. Build command and
   publish directory come from `netlify.toml` automatically.
   ⚠ Before the first deploy with these functions, apply `MIGRATION.md`
   to a staging Airtable base (new Moves fields, password hashing).
4. **Check the deploy log.** The build gate prints a tick-list. If anything
   is wrong — including any file that shouldn't exist — the deploy STOPS
   and names the file. A green deploy now means a clean repo, verified.
5. **Archive the old repo.** Old repo → *Settings* → scroll to the bottom →
   *Archive this repository*. Nothing is deleted; it just can't confuse
   anyone again.

## Why not clean the old repo in place?

You can (delete each stray file via its ··· menu → *Delete file*), but the
web interface only deletes one file at a time, you'd need the full list of
strays, and one missed `getportfolio.js` keeps deploying an outdated
endpoint silently. The fresh repo takes the same ten minutes and ends
certain.

## The guard that keeps it clean

`scripts/check.js` now contains the repository manifest. Every deploy
verifies the tree against it: an unexpected file — including the
hyphen-stripped duplicates the GitHub uploader creates — fails the build
and prints the filename to delete. Adding a genuinely new file means adding
it to the manifest in the same commit. The mess cannot come back without
the build saying so.
