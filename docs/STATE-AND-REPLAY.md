# State and replay contract

## Checkpoint format

`examples/checkpoint.json` wraps a complete agent state with its validated world configuration. Its schema identifier is `forklet/checkpoint/1`; the embedded agent state uses `forklet/state/1`. The model version is `forklet/rnn8/1`.

The engine requires the saved state's seed and tick to match the declared seed and fork point. It validates counters, vector shapes, resource signs, supported weight magnitudes and memory ranges before returning a deep copy.

## What must survive serialization

| Component | If omitted |
|---|---|
| Model weights and readout | Same seed is insufficient if parameters were edited |
| Hidden vector | Recurrent history is lost |
| Six-observation memory | Explicit history term changes |
| Cash, inventory, fees | Constraints and endogenous inputs change |
| Previous move | One input channel changes |
| Random state | Subsequent sampled actions may change |
| Configuration and model version | World reconstruction may be incompatible |

All state is plain JSON. No functions, closures, native image objects, API credentials or browser references are serialized.

## Replay original branch A

```sh
node scripts/replay.mjs examples/checkpoint.json
```

The CLI validates the checkpoint, reconstructs its world, runs the original-evidence continuation, and prints final state and marked value as JSON. It limits checkpoint input to 1 MB. The reference checkpoint resumes 72 decisions.

To replay treated B from source, restore a second independent state and call `decision(state, world, config, true)` at each step. Do not reuse the already-advanced A object.

## Identity and integrity are different

`stateId` is a short FNV-1a checksum of the serialized checkpoint. It is useful for visual matching during debugging. It is order-sensitive, has collisions, and is not a cryptographic commitment.

`MANIFEST.sha256` hashes package files for local integrity checking. It does not sign them or establish an author. A replay receipt is self-reported output and metadata, not independent verification or blockchain evidence.

## Numerical portability

The seed stream uses 32-bit integer operations. The recurrent model uses floating-point arithmetic and transcendental functions. Exact replay is tested in the same JavaScript runtime; tiny last-digit differences can occur across engines or architectures. Do not claim cross-platform bitwise identity for floating-point traces without testing it.

Changing the model formula, world generator or draw schedule requires a model/schema compatibility decision. Reusing an old receipt after such a change without a new version would be misleading.
