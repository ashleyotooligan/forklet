# Architecture

## Boundaries

| Layer | Entry point | Owns | Does not own |
|---|---|---|---|
| Configuration | `src/core/config.mjs` | Bounds and scenario names | Rendering or I/O |
| World | `src/core/world.mjs` | Exogenous synthetic prices and channels | Agent actions |
| Controller | `src/core/network.mjs` | Fixed recurrent update and policy distribution | Training |
| Engine | `src/core/engine.mjs` | Agent state, intervention, draw, execution | Files or network |
| Laboratory | `src/lab/fork.mjs` | Shared prefix, deep fork, paired metrics | Browser state |
| Figures | `src/view/render.mjs` | Twelve Canvas compositions | New data generation |
| Browser | `src/view/app.mjs` | Controls and downloads | Wallets or hosted APIs |
| Tooling | `scripts/` | Build, replay, study generation, capture, checks | Production deployment |

## One decision

Read the current world row and endogenous resource channels. Save those as `raw`. Copy them to `effective`, then apply B's declared intervention if active. Update the recurrent vector, compute the policy distribution, consume one uniform draw, select one action, update memory, execute the constrained paper action, and increment the tick.

The returned frame retains both inputs, the draw, probabilities, selected action, filled amount, fee, resources and hidden state. Rendering consumes these frames; it does not invent its own signals.

## One fork

The runner generates a single world, advances the parent to the fork, deep-copies the entire state twice, and advances A and B in lockstep. World data is read-only by convention; tests check that execution does not mutate it. The model is embedded in each copy rather than shared through mutable references.

## Build modes

`index.html` loads ES modules, artwork and batch JSON through a local server. `Forklet.html` embeds the same modules in explicit dependency order and includes two base64 PNGs plus reference-study data. It performs no runtime fetches in standalone mode.

The build is intentionally small and explicit, not a general-purpose JavaScript bundler. If source imports change shape or modules gain naming collisions, update the module list and build tests. The offline wiring harness compiles and exercises the generated script, but is not a browser engine.

## State ownership

| Object | Mutation policy |
|---|---|
| World array | Read-only during execution |
| Saved checkpoint | Immutable by convention after cloning |
| A and B state | Mutated independently by `decision` |
| Returned frame | Snapshot arrays for inputs and hidden state |
| Browser view state | Selects a plate and focus decision; does not edit recorded frames |

No state is sent to external services. Exports are browser-created downloads or local CLI output.
