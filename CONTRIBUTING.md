# Contribute an inspectable difference

Start by running `npm test` and reading [methods](docs/METHODS.md) and [limitations](docs/LIMITATIONS.md). Prefer small changes whose effect can be traced through saved state and recorded frames.

## For model or experiment changes

1. Describe the question and declare the intervention before interpreting results.
2. Preserve the unchanged negative control.
3. Keep action-draw consumption explicit and paired.
4. Update schema or model versions when replay compatibility changes.
5. Include all declared seeds, not only dramatic trajectories.
6. Regenerate data, results, standalone output and affected figures.
7. Run tests and package checks, then refresh the SHA-256 manifest.

## For visual changes

Keep the plain-background character identity and distinct plate compositions. Draw exact labels and data from code, not an image model. Do not replace the folio with repeated dashboard cards. Include a before/after figure and state whether data changed.

## For integrations

Keep external observations, wallet handling and chain attestation outside the deterministic core. An optional chain record must not be described as proving correct intelligence or profitable trading. No secrets or private wallet data belong in fixtures or issues.

## Review checklist

- Does replay preserve the full required state?
- Are selected actions distinguished from actual paper fills?
- Are probability changes reported even when actions match?
- Are new claims supported by code or explicitly identified as future work?
- Do all README image paths open from the repository root?

Open an issue with a reproducible seed, configuration and version. See [security](SECURITY.md) for sensitive reports.
