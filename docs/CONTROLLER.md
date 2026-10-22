# The controller, without mystique

## Fixed recurrent model

The controller is an eight-unit tanh recurrent system with a hand-designed policy readout. Seeded small weight variations create reproducible model instances. There is no training loop, gradient update, reward learning, pretrained model, language reasoning, or claim of general intelligence.

For input vector `x`, previous hidden vector `h`, input matrix `W`, recurrent matrix `R`, and bias `b`, each next activation is:

```text
h_next[i] = tanh(b[i] + sum_j W[i,j] x[j] + sum_j R[i,j] h[j])
```

The recurrent matrix has a 0.48 diagonal and small seeded off-diagonal weights. The bulletin input receives additional signed structure across alternating units. The readout is a fixed eight-value vector. All parameters are saved in the checkpoint.

## Eight input channels

| Index | Channel | Range / meaning |
|---:|---|---|
| 0 | Momentum | Clamped four-tick price change × 25, in −1..1 |
| 1 | Bulletin | A synthetic sine signal in approximately −0.82..0.82 |
| 2 | Volatility | Clamped absolute one-tick move × 60, in 0..1 |
| 3 | Reliability | 0.85 normally; 0.15 under that intervention |
| 4 | Cash share | Cash divided by marked resources |
| 5 | Exposure | Marked inventory divided by marked resources |
| 6 | Previous move | +1 ADD, 0 HOLD, −1 REDUCE |
| 7 | Clock | `sin(worldTick / 16)` |

## Policy distribution

Let `history` be the mean of recent effective bulletins and `r` the reliability channel. The score is:

```text
score = r × (0.65 momentum + 0.95 bulletin + 0.20 history + dot(h_next, readout))
logits = [1.9 score, 0.28 + 0.8(1-r) + 0.25 volatility, -1.9 score]
```

A numerically stabilized softmax converts the logits into probabilities for ADD, HOLD and REDUCE. One seeded uniform draw selects an action through cumulative probability intervals. Lower reliability reduces directional strength and adds to the HOLD logit; it is not a calibrated confidence score.

## Memory

The controller retains up to six effective observations containing bulletin, momentum and reliability. Only mean bulletin enters this edition's explicit history term; other retained fields support inspection and possible later experiments. Memory updates after computing the current action distribution.

## Interpretation

The eight units are meaningful as inspectable computational state, not as named anatomical regions or discovered neural circuits. A colorful state sketch does not make them biological. Treat the formula and saved numbers as the model specification.
