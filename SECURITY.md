# Security policy

Forklet 0.1.x is local experimental software. It does not request seed phrases, private keys, exchange credentials, wallet signatures or deposited funds. Any page claiming those are required is outside this package's design.

## Runtime boundary

The local server binds to `127.0.0.1`. Do not expose it as a production server or run unreviewed forks with sensitive files in the project directory. The standalone edition performs no network fetches during normal operation.

Checkpoint and configuration files are data, not scripts. The CLI validates supported fields and basic numerical bounds. These checks are not a formal sandbox or a complete hostile-input security audit. Do not load untrusted modified HTML or JavaScript.

## Reporting

If the repository's private vulnerability-reporting feature is enabled, use it for sensitive reports. Otherwise, open a minimal issue asking for a private reporting channel without disclosing exploit details, credentials or personal information. No response-time guarantee is offered.

Report the version, runtime, affected command and a sanitized reproduction. Do not upload real wallet keys, tokens, private market data or personal account exports.

## Scope

Source, local server, generated offline bundle and parser behavior are in scope. There is no deployed Solana program, token contract or custodial service to audit in this edition. SHA-256 file checks and the debug state ID are not author authentication.
