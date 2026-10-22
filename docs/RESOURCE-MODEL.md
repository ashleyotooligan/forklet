# A paper market as a consequence layer

## Units

The fictional asset is **DEMO**, with prices expressed as paper SOL per DEMO. DEMO is not a deployed mint. SOL is a familiar accounting denomination here, not an RPC-connected asset or a wallet balance.

Every parent begins with 10 paper SOL and zero DEMO. The first 24 decisions occur before the default fork. A and B inherit the same resulting balances and cumulative fees.

## Shared price path

The initial pre-update price is 0.25. At each world tick, a small smooth trend and seeded noise produce a new strictly positive price, floored at 0.05. The recorded first price includes the first update. All branches read the same pre-generated path; agent actions cannot affect it.

This deliberately excludes order books, pools, liquidity, route selection, slippage, MEV, latency-dependent fills and price impact. The late-evidence intervention delays information, not execution price.

## ADD

Let cash be `c`, inventory `q`, price `p`, and marked value `V = c + qp`.

```text
budget = min(0.35, c, max(0, 0.60V - qp))
fee = budget × feeRate
received DEMO = (budget - fee) / p
cash -= budget
inventory += received DEMO
```

The exposure constraint limits additions at the current mark. It does not force liquidation if a later price move increases exposure beyond 60%.

## REDUCE and HOLD

```text
sold DEMO = min(inventory, 0.35 / p)
gross = sold DEMO × p
fee = gross × feeRate
cash += gross - fee
inventory -= sold DEMO
```

HOLD leaves balances and cumulative fees unchanged. REDUCE with no inventory and ADD with no available budget are valid selected actions with zero notional execution.

## Accounting invariant

At a fixed execution price, marked value immediately after execution equals marked value before execution minus the charged fee, up to floating-point precision. Fees are already reflected in balances. Subtracting cumulative fees again from `cash + inventory × price` would double-count them.

There is no leverage, shorting, borrowing, margin or transfer between branches. Value can change between decisions because the shared fictional mark changes.

## Why resources are secondary

The primary output is how changed evidence propagates through a stateful decision process. The resource layer makes downstream consequences tangible, but it is neither a realistic Solana market simulator nor a return forecast.
