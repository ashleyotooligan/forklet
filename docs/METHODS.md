# Paired-fork methods

## Experimental unit

A run is a synthetic controller, an exogenous fictional market path, a complete saved state at a declared fork, and two continuations. The study asks how a specified observation intervention changes this implemented system. It is not a biological or financial experiment.

The default begins with seed 17 and 10 paper SOL. The parent makes 24 decisions. Its state is serialized and deep-copied into A and B. Both copies retain the same model, recurrent activations, observation memory, paper resources, previous-action input and pseudorandom state.

## Intervention protocol

A receives unmodified observations. B receives the configured treatment for a finite window. Opposite bulletin changes one channel. Lower reliability changes one channel. Late evidence changes two explicitly declared channels: momentum and bulletin. Current price, volatility and the common world are not delayed.

An intervention is applied before the recurrent update and action sampling. It is not applied retroactively. Once the window ends, B again receives current unmodified exogenous channels. Internal and resource differences can persist.

## Common randomness

The action sampler consumes exactly one seeded uniform draw per branch per step. Copying the random state and preserving the draw schedule couples the two continuations. The synthetic world and model construction have separate seeded streams, so their generation does not consume agent action draws.

The common-random-number coupling is part of this experiment's definition. Action disagreement counts depend on this coupling; they should not be interpreted as the only possible distance between the policies. Total variation gives a distribution-level comparison independent of a particular sampled action at that step.

## Negative control

The identical-evidence condition makes no intervention. It must produce identical full states and recorded frames, including resources. Any failure is a correctness issue, not a surprising finding. All twelve reference seeds include this control.

## Descriptive results, not a performance benchmark

The reference study uses twelve declared seeds and four conditions, with 72 post-fork paired decisions per run. It does not optimize parameters, compare against trained baselines, or establish statistical significance. The market is fictional and the policy is hand-specified.

The seed-17 late-evidence run is intentionally retained: the internal state and action probabilities differ during the intervention, yet actions match. Later recurrent differences fade below floating-point resolution. Selecting only dramatic trajectories would misrepresent the experiment.

## What a paired difference means here

At the instant of the fork, the declared intervention is the only changed input. Thereafter, endogenous channels such as cash share, exposure and previous move can differ because actions differ. Report those consequences instead of describing every later observation as otherwise identical.

The world is unaffected by either agent. This removes market feedback and makes the comparison inspectable, but limits realism. See [limitations](LIMITATIONS.md).
