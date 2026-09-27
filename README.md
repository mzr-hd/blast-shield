# ReplayGuard

> **Most AI coding tools give you one fix. ReplayGuard gives you three — verified.**

A decision-support prototype for **IBM Bob 2.0**, built for the **IBM Bob 2.0 Hackathon — September 2026**.

ReplayGuard demonstrates a developer workflow for investigating a runtime contract-drift incident, comparing multiple remediation strategies, and verifying a selected fix before committing to it.

---

## The Problem

A seemingly harmless API change can break a downstream service without causing compilation errors.

For example:

```text
status
↓
paymentStatus
```

The API implementation has been updated, but a downstream consumer still expects `status`.

The result can be:

- code that still compiles
- tests that remain green because they use stale mocks
- documentation that no longer matches the implementation
- a runtime failure in a downstream service

This is a form of **contract drift**.

The difficult part is not only finding the bug. A developer also needs to understand:

1. Where the failure originates
2. What downstream components are affected
3. Why existing tests did not catch it
4. Whether documentation is also stale
5. Which remediation strategy should be used
6. Whether the selected remediation actually works

ReplayGuard explores this workflow using IBM Bob 2.0.

---

## What ReplayGuard Demonstrates

The included `demo-target/` repository contains a deliberately constructed contract-drift scenario.

ReplayGuard turns Bob's analysis into an interactive decision-support workspace:

### 1. Incident Header

Displays the incident, affected workspace, and analysis status.

### 2. Architecture Blast Radius

Visualizes how the contract mismatch propagates through the sample service architecture:

```text
Payment API
     ↓
Checkout Service
     ↓
Notification Worker
```

The failure cascade can be simulated interactively.

### 3. Cinematic Failure Replay

Replays the failure sequence step-by-step with file and line references.

```text
Payment API
     ↓
Checkout reads old field
     ↓
Contract mismatch
     ↓
Checkout fails
     ↓
Notification is blocked
```

### 4. Documentation Drift

Compares the documented API contract against the implementation and highlights the mismatch.

### 5. False-Green Test Trap

Shows how an outdated mock can allow the existing test suite to remain green even though the real API contract has changed.

### 6. Remediation Lab

Presents three different remediation strategies:

- **Compatibility / Adapter**
- **Strict Contract Migration**
- **Boundary Contract Enforcement**

Each strategy exposes its affected files, implementation trade-offs, compatibility implications, and proposed changes.

### 7. Dynamic Diff Viewer

Displays the code changes associated with the selected remediation strategy.

### 8. Verification Gate

Shows the verification state before and after applying the selected remediation.

The goal is not simply to produce a patch.

> **The goal is to give the developer evidence and alternatives before committing to a fix.**

---

## How IBM Bob 2.0 Is Used

IBM Bob 2.0 is used as the engineering agent behind the demonstrated workflow.

### Agent Mode

Bob investigates the `demo-target/` repository, examines the code, tests, and documentation, and develops remediation strategies.

### Parallel Subagents

Multiple focused investigations are used to explore competing remediation approaches rather than asking for only one solution.

### Document Understanding

Bob compares the API documentation with the implementation to identify documentation drift.

### Project Guidance

The project uses `/init` and `AGENTS.md` to provide project-scoped instructions to Bob.

### Analysis Output

Bob's resulting analysis is stored in:

```text
src/data/bob-analysis.json
```

The React application uses this analysis as the data source for the decision-support interface.

The repository also contains:

```text
bob_sessions/
```

which documents the Bob development sessions used to produce the prototype.

---

## Architecture

The prototype separates the **analysis work** from the **decision-support interface**:

```text
                 IBM Bob 2.0
                      │
                      ▼
             Repository Analysis
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Code          Tests          Docs
        │             │             │
        └─────────────┼─────────────┘
                      ▼
              Bob Analysis Output
                      │
                      ▼
             bob-analysis.json
                      │
                      ▼
               ReplayGuard UI
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      Replay       Compare        Verify
        │             │             │
        └─────────────┼─────────────┘
                      ▼
              Developer Decision
```

ReplayGuard's interface is therefore a **decision-support layer** over the analysis produced during the Bob workflow.

---

## Demo Repository

The `demo-target/` directory contains the sample project used by the prototype:

```text
demo-target/
├── src/
│   ├── api/
│   │   └── payment.ts
│   ├── services/
│   │   ├── checkout.ts
│   │   └── notification.ts
│   └── types/
│       └── payment.ts
├── tests/
│   ├── payment.test.ts
│   └── checkout.test.ts
└── docs/
    └── api-spec.md
```

The scenario intentionally contains a mismatch between the documented/API contract and the downstream consumer.

This makes it possible to demonstrate the complete:

```text
Failure → Investigation → Alternatives → Verification
```

workflow using a deterministic sample project.

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/mzr-hd/replayguard.git
cd replayguard
```

### 2. Install the dashboard dependencies

```bash
npm install
```

### 3. Start ReplayGuard

```bash
npm run dev
```

The Vite development server will provide the local dashboard URL.

---

## Verify the Demo Repository

The sample project can also be tested independently.

Open a second terminal:

```bash
cd demo-target
npm install
npm test
```

The intentionally broken scenario should reproduce the contract-drift failure described in the dashboard.

The existing tests include coverage demonstrating how a legacy mock can remain green while the real contract has changed.

> **Do not rely on the README's expected output if the repository has been modified. Run the tests and use the actual result.**

---

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide**
- **IBM Bob 2.0**
  - Agent Mode
  - Subagents
  - Parallel tasks
  - Document Understanding

---

## Repository Structure

```text
ReplayGuard/
├── src/
│   ├── App.tsx
│   └── data/
│       └── bob-analysis.json
│
├── demo-target/
│   ├── src/
│   ├── tests/
│   └── docs/
│       └── api-spec.md
│
├── bob_sessions/
│   └── ...
│
├── AGENTS.md
├── package.json
└── README.md
```

---

## Live Demo

A deployed version of ReplayGuard is available through the hackathon submission.

**Live Demo:** https://replayguard-mzr-hd.vercel.app/

---

## Hackathon

Built for the **IBM Bob 2.0 Hackathon — September 2026**.

ReplayGuard explores a simple idea:

> **Bob explores the solution space. The engineer decides.**

---

## License

MIT
