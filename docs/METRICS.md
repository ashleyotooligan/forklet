# Compare more than the ending

## Action disagreement

For paired decision `t`, the indicator is 1 if A's selected action differs from B's selected action, otherwise 0. The summary counts these indicators across post-fork decisions only. Default denominator: `96 - 24 = 72`.

Action disagreement is not execution disagreement: selected ADD or REDUCE may be blocked by paper constraints. It also depends on the shared-random-number coupling. Equal actions do not imply equal policies.

## Total variation distance

For three-action distributions `p_A` and `p_B`:

```text
TV = 0.5 × sum_i abs(p_A[i] - p_B[i])
```

The range is 0..1. Zero means equal action probabilities at that step. The plotted mean is the arithmetic average of post-fork TV values; the shared prefix is plotted at zero but excluded from that mean.

The shaded span on the divergence plate marks the configured treatment window. The curve may stay nonzero after the window because internal state and endogenous resource inputs have already diverged.

## Hidden-state L2

```text
L2 = sqrt(sum_i (h_A[i] - h_B[i])²)
```

There are eight activations in −1..1. The theoretical distance bound from that range is `sqrt(32)`, approximately 5.657. This is a raw coordinate distance, not a calibrated semantic difference or intelligence score.

## First disagreement

The first post-fork decision whose selected actions differ. `null` means there is none. Fork 24 starts comparison at decision 25, not at zero-based world tick 24 in the displayed UI.

## Paper resource gap

At each paired step: marked value of B minus marked value of A, at the same fictional current price. It is descriptive output of the toy resource model. It does not establish an advantage on real markets or isolate a forecasting effect from execution constraints.

## Fixed reference study

The twelve-seed plate shows counts for all four conditions. Each seed has 72 paired decisions. Small vertical offsets separate otherwise overlapping dots; the offsets encode no additional variable. No significance tests or uncertainty intervals are claimed in this edition.
