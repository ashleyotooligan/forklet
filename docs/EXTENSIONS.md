# Extension boundaries

These are engineering directions, not shipped integrations. Keep observation, computation, accounting and attestation separate so that adding one does not silently imply the others.

## 1. Read-only Solana observations

A future adapter could translate finalized, timestamped public observations into versioned replay fixtures. Each fixture should include source identifiers, observed and retrieved timestamps, normalization rules, missing-data policy and a content digest.

Historical observations must respect the information cutoff: a decision should never receive records obtained later unless that late arrival is explicitly the intervention. A provider's response is not ground truth by itself, and live-data ingestion should remain separate from the deterministic fixture runner.

No RPC client or provider integration is included in this release.

## 2. Receipt anchoring without execution

A minimal future chain record could bind a cryptographic digest of a replay bundle to a schema version and author-controlled signing identity. The full bundle would remain content-addressed off-chain, while the record supplies a timestamped reference and transaction identifier.

| Record field | Purpose |
|---|---|
| Schema version | Interpretable encoding |
| Bundle digest | Commitment to exact bundle bytes |
| Model version | Link to implementation contract |
| Fixture digest | Link to exact external observations |
| Fork and intervention | Declared comparison |
| Author identity | Who submitted the record, not who proved it correct |
| Transaction reference | Evidence of submission if actually confirmed |

Define canonical serialization before hashing; do not reuse the current FNV-1a debug ID. Do not publish secret inputs or assume a digest grants privacy. An anchor establishes a commitment to bytes under the chosen chain assumptions; it does not establish profitable behavior, genuine intelligence or scientific validity.

No program ID, wallet adapter, transaction builder, deployed account or confirmed anchor is shipped here.

## 3. Stronger model experiments

Replace the toy controller behind an explicit interface while preserving checkpoint exports, draw accounting and negative controls. A remotely hosted LLM does not automatically provide cloneable hidden state or deterministic replay. If only a transcript can be copied, call it transcript branching rather than a complete internal-state clone.

## 4. Alternative worlds

Introduce endogenous market feedback as a separate study. Once actions affect the environment, two branches no longer share the same realized world path. Define whether the comparison shares exogenous noise, initial liquidity, counterparty actions, or a recorded replay. Do not keep using the current shared-path interpretation unmodified.
