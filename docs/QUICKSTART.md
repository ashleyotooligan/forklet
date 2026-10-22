# Start with one fork

## No-install route

1. Download and extract the repository ZIP.
2. Open `Forklet.html` in a modern browser.
3. Choose **Opposite bulletin**, seed **17**, and fork **24**.
4. Click **Run comparison** and open **08 · Decision diff**.

You should see decision 25 as the first disagreement. A selects ADD; B selects REDUCE. The common draw is the same in both branches. The probability distributions differ.

## Source route

Use Node.js 20 or newer. From the folder containing `package.json`, run:

```sh
npm start
```

Open `http://127.0.0.1:4173`. The server binds to loopback only. To use a different port, set the `PORT` environment variable to an integer between 1024 and 65535.

No `npm install` is needed for the runtime or tests. No API keys, Solana wallet, Python environment, account, or hosted service is required.

## The first five minutes

| Try | Look for |
|---|---|
| Identical evidence | Zero disagreement and zero probability/state distance |
| Late evidence, seed 17 | Different probabilities, identical sampled actions |
| Decision slider | State sketches at a different paired decision |
| Fork after 40 | A different saved history before the intervention |
| Checkpoint JSON | Full model, memory, balances and random state |
| Save figure | A PNG of the current plate at 1440 × 1080 |

The slider affects state-focused views; summary and full-trajectory views intentionally remain full-run summaries. The fixed twelve-seed study does not change with the interactive seed.

## Common problems

- **Blank `index.html`:** use `npm start`, or open the self-contained `Forklet.html` instead.
- **Broken README images on GitHub:** upload `assets/` beside `README.md`, preserving folder names and case. See [upload instructions](GITHUB-UPLOAD.md).
- **Old standalone output after editing:** run `npm run experiments` if the model changed, then `npm run build`.
- **Missing native renderer:** only figure regeneration needs `@napi-rs/canvas`; normal use does not.
- **Unexpected selected ADD with no balance change:** execution is constrained by cash and exposure. An action is not necessarily a fill.
