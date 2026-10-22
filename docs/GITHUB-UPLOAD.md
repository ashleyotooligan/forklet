# Upload Forklet to GitHub

## Repository details

**Owner:** `ashleyotooligan`  
**Repository name:** `forklet`  
**Visibility:** Public, if you want people to browse the experiment.

**Description**

> One state. Two information paths. A reproducible decision-fork experiment with synthetic memory, paired actions, and SOL-denominated paper resources.

**Initial commit title**

> Introduce Forklet: one state, two information paths

**Optional extended commit description**

> Add the paired-fork engine, four intervention studies, twelve experiment plates, original Forklet character, replayable checkpoints, offline demo, detailed methods, and verification tests.

**Topics:** `forklet`, `decision-systems`, `reproducibility`, `simulation`, `recurrent-network`, `counterfactual`, `paper-trading`, `solana`.

## Browser upload

1. Extract `Forklet-GitHub.zip`.
2. Open the extracted **`forklet`** folder. You should see `README.md`, `package.json`, `Forklet.html`, and folders such as `assets`, `src`, `docs` and `.github` together.
3. Create the new `forklet` repository. Leave the automatic README, license and `.gitignore` options empty because the package includes them.
4. Choose **Add file → Upload files**.
5. Select **all the contents inside `forklet`**, including the folders, and drag them onto the upload area. Do not upload only the loose files and do not upload the ZIP itself.
6. Wait until nested paths such as `assets/screenshots/08-diff.png` appear in the upload list.
7. Add the commit title above and complete GitHub's commit or proposed-change flow.

**Important:** `README.md` and `assets/` must be siblings at the repository root. Do not create an extra `forklet/forklet/` layer. Folder upload support can vary by browser; use drag-and-drop of the extracted contents, or Git/GitHub Desktop if folders are skipped.

The prepared repository has fewer than 100 files and no individual file near 25 MiB. GitHub's browser uploader currently permits up to 100 files per upload and 25 MiB per file. See [GitHub's official upload guide](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository), checked 21 October 2026.

## Command-line alternative for a new, empty repository

Run from the extracted `forklet` folder only after creating an empty repository under your account:

```sh
git init
git add .
git commit -m "Introduce Forklet: one state, two information paths"
git branch -M main
git remote add origin https://github.com/ashleyotooligan/forklet.git
git push -u origin main
```

Authenticate through GitHub's normal prompts. No token belongs in a source file, README or command pasted into a public issue. If the remote already has commits, clone it first and copy this package into that clone; do not force-push over existing work.

## Confirm the images

At the root, verify that `assets/`, `docs/`, `src/`, `data/`, `experiments/`, `examples/`, `schemas/`, `scripts/` and `tests/` are present. `.github/` contains the workflow and templates.

Open the README. The plain-background Forklet character should appear at the top, followed by the wide cover. All twelve plate images should render farther down. Click a direct image link: `assets/screenshots/08-diff.png` must open, not return 404.

If images fail, check the actual uploaded paths before editing Markdown. Upload missing folders at the root; do not flatten their contents.

## Optional social image

Use `assets/brand/forklet-cover.png` as the repository's social preview image. Use `assets/brand/forklet-agent.png` when you need the plain character portrait. The README portrait and wide social cover are supplied as separate branding assets.
