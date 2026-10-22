# Run and alter a declared experiment

## Four source configurations

| File | Condition |
|---|---|
| `experiments/01-opposite-bulletin.json` | Invert B's bulletin |
| `experiments/02-late-evidence.json` | Delay B's momentum and bulletin by six ticks |
| `experiments/03-lower-reliability.json` | Set B's reliability channel to 0.15 |
| `experiments/04-identical-evidence.json` | No intervention |

Run one and print its complete receipt:

```sh
node scripts/run.mjs experiments/01-opposite-bulletin.json
```

The command reads JSON only and writes its receipt to standard output. It does not modify project files or send anything to a chain. The output includes summary, full saved starting state and configuration.

## Change a parameter

Copy a configuration into a local working file, then change its seed, fork point or intervention duration. The engine validates seed and horizon bounds. Duration is a requested window; if the run ends first, only the remaining decisions are affected. Keep that effective duration in your report.

Do not change multiple fields while describing the result as a single-channel intervention. For example, changing both seed and bulletin treatment changes the model instance, world path, draw schedule and evidence, not just the bulletin.

## Reference study generation

`npm run experiments` always regenerates the declared twelve-seed reference study with fixed fork 24, horizon 96, duration 18 and fee 0.003. It also writes the default run and examples. This fixed study is distinct from running a custom configuration.

All four conditions share the same seeds. A seed determines three separately initialized streams: model construction, world generation and action sampling. The pre-fork state therefore matches across conditions for the same seed.

## Useful follow-up experiments

- A short pulse versus a long intervention, keeping everything else fixed.
- Early versus late fork points, reporting the changed shared history.
- Intervention after the bulletin crosses zero versus near its maximum.
- A zero-fee sensitivity study, with action metrics and resource metrics kept separate.
- Memory ablation as an explicitly new intervention, not an undocumented field edit.

Keep a no-change control for every new protocol. Record disappointing or null results rather than selecting only visually dramatic cases.
