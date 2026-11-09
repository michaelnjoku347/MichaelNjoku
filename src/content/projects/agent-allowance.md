---
title: Agent Allowance
summary: A spending account for an AI agent. Rules decide first; your Ledger signs the exceptions.
year: 2026
type: Hackathon
order: 2
cover: ./images/agent-allowance.webp
coverAlt: Agent Allowance’s home screen. A teal gauge disk shows 0.14 RLUSD left of a 0.20 budget, with limit tiles, a payment path, and recent activity underneath.
repo: https://github.com/michaelnjoku347/Agent-allowance
tags: [JavaScript, Node.js, React 19, Vite, XRPL, x402, AP4M, Ledger, Express, Amazon Bedrock]
highlights:
  - 'Built for the Mastercard × XRPL Hackathon (Agentic Finance). The agent pays merchants with AP4M x402 vouchers settling RLUSD on XRPL EVM Testnet, only inside rules you set.'
  - 'Rules run before anything is signed: allowlisted merchants, a per-purchase cap, a budget, and an end date. Quotes outside those limits wait for a Ledger ApprovePurchase signature.'
  - 'Eve, the owner’s assistant, reads the whole account and can open pages or propose a freeze or decline. She never signs, spends, or changes rules on her own.'
  - 'Hosted public demo mode gives each visitor a private sandbox with a labeled simulated Ledger signature, so judges can try the product without installing anything.'
---

Would you give an AI your credit card? Agent Allowance is a spending account for an AI agent. You fund a small budget — **0.20 RLUSD** in the demo. The agent pays a merchant on its own only when the quote is from a merchant on your list, at or under a **0.05 RLUSD** cap per purchase, before the allowance ends, and still inside the budget. Anything else waits for you, and your Ledger approves it.

Payments are **AP4M x402** vouchers settling **RLUSD** on **XRPL EVM Testnet** (chain ID `1449000`). Built for the Mastercard × XRPL Hackathon, **Agentic Finance** track.

It is not hosted as a permanent public demo from this site. The code, screenshots, and deploy notes are on [GitHub](https://github.com/michaelnjoku347/Agent-allowance).

## What you can do

- See remaining budget as a gauge disk, the five limits as tiles, spend by merchant, and the latest activity.
- Set it up in a minute: name the agent, set the budget and cap, choose merchants, pick an end date, and connect a Ledger as the approver.
- Understand every hold: which rule a purchase hit, how far over the cap it is, and exactly what the Ledger signs.
- Ask **Eve** anything about the account. She reads; the only actions she can propose are a freeze and a decline, which you confirm.
- Freeze everything at once. Unfreeze is one obvious button away.

## How it works

1. **Rules first.** `checkRules` reads the merchant’s HTTP 402 quote and stops at the first failure: expired, merchant not allowed, over the cap, or over the budget. Nothing is signed on a failure.
2. **Jev, second.** Optional risk review can hold a quote for a person after the rules allow it. Jev cannot spend past a rule.
3. **AP4M x402.** The agent reuses an open Channel, signs one voucher, and the merchant redeems it on XRPL EVM Testnet.
4. **Ledger for exceptions.** Out-of-rule purchases and allowance raises need EIP-712 signatures (`ApprovePurchase`, `SetAllowance`). Lowering a limit applies without a signature.

## Run it

You need Node.js 22.13 or newer. From the repo:

```bash
cp .env.example .env
npm start    # API :8787, dashboard :5173
```

Or deploy the hosted public demo from `render.yaml` — every visitor gets a private sandbox, and approvals use a clearly labeled simulated Ledger signature.

```bash
npm test
npm --prefix dashboard run build
```
