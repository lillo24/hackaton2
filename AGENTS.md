# Code Organization - Multi-file projects (folder/file-level abstraction)
- Use the **file/folder** as the main unit of abstraction.
- Each file should have a clear **abstract purpose** (what it owns / what it is responsible for).
- In each folder, keep a small **map file** (e.g., `README.md` or `map.txt`) listing:
  - each file in that folder
  - its purpose (brief)
  - why the files are in the same folder / how they connect
  - (optional) any especially important internal blocks inside a file, with a short explanation of why they matter.

## Stability status (“polished” vs “under production”)
Optionally, assign a stability/status label per file (or per module) to make it obvious what is:
- still being experimented on / needs review
- solid and unlikely to change

Suggested labels:
- `DRAFT`
- `STABLE`
- `FROZEN` (could be a preview / example / etc. not-to-change file)

Include a short note explaining *why* a file has that status (e.g., “missing tests”, “interface still changing”, etc.).

—

# Reproducibility and Traceability
## Doc/Comment Sync (non-obvious changes)
If you introduce or modify **non-obvious behavior** or **configuration**, you must update the closest appropriate documentation (or inline comments) in the same change.

Examples that require an update:
- new env vars / config keys / flags
- default values that change behavior
- implicit assumptions (paths, locale/timezone, encoding, auth, caching)
- new required setup steps
- behavior that differs across environments (dev vs prod, Windows vs Linux)

Where to document:
- prefer the nearest “source of truth”
E.g. README / “map.txt” / config schema-docs / docstring or comment at the interface

Goal: someone can reproduce the behavior without reading the whole codebase.

—

# Handling Doubts & Architecture Fit
## 1) Underspecified requirements: decide what you can safely assume
If something important is unclear, do **not** silently guess.

Use this rule:
- **If multiple reasonable interpretations would change behavior/output:** ask (or surface 2 options and pick the safer default).
- **If there is a safe, conservative default that preserves existing behavior:** proceed, but **state the assumption** explicitly.

Examples of “important” ambiguity:
- expected output format, business rules, edge-case handling
- security/privacy implications
- breaking changes to interfaces
- performance/caching behavior

**Never** introduce new features “because it might be useful”.

## 2) Architecture quick-check (before editing)
Before making non-trivial changes:
- Identify the **owner** of the responsibility you’re touching (which file/module is supposed to own it).
- Check for existing patterns (how similar things are done elsewhere).
- Keep changes consistent with the repo’s abstractions unless the request explicitly says to change them.

If your change would violate an existing abstraction, either:
- find the correct place to implement it, or
- clearly propose the refactor as a separate step (do not blend it in silently), thus discuss it with the user

—

# GitHub Repo Workflow
## Push always after an implementation plan
After an implementation plan, push to a branch.
Before pushing: ensure git status is clean and no secrets/data are included.

## Data never goes into Git
Ensure .gitignore excludes:
- ingestion_pipeline/data/** (raw, extracted, logs, sqlite db)
Never commit secrets. Use .env locally and commit only .env.example (sanitized).

If you need a sample dataset, commit only a tiny curated subset under examples/ (never a full crawl).

—

# Libraries and Dependencies
## Follow the versioned documentation
- Always check the documentation for the **exact version** used in the repository (lockfile / package manager / requirements).
- If you want to use **bleeding-edge** or unreleased features, you must:
  - state it explicitly
  - explain why it’s worth the risk
  - provide a fallback (or avoid it)

## Adding dependencies (be conservative)
- Add a dependency only if it’s clearly justified and not already available in the stack.
- Prefer well-maintained, widely used libraries.
- Keep versions pinned (or consistent with the repo’s policy).

## Removing dependencies (double-check usage)
- Before removing a dependency, verify it’s not used in:
  - Before removing, run a repo-wide search for the dependency name and its common import paths.
  - runtime code imports
  - build scripts / CI
  - tooling configs (lint/format/test)
  - documentation examples

—

# Change Discipline (Minimize Unintended Damage)
Default stance: **conservative edits**. Prefer correctness + stability over “improvements”.

## 1) No Unrelated Changes
Unless explicitly needed, do **not**:
- rename files/folders/symbols
- reformat code or reorder imports
- reorganize modules
- “modernize” patterns or style

If formatting happens automatically, try to **limit it** to the smallest area.

## 2) Respect Interfaces (Contracts)
Treat public surfaces as fragile:
- function signatures / return shapes / error behavior
- file formats / schemas
- CLI flags / config keys
- endpoints + payloads (if any)

If you must change a contract:
- update **all** call sites in the same change
- document the change at the interface boundary (docstring/comment + relevant docs)

## 3) Preserve Behavior by Default
- Keep existing behavior unless the request **explicitly** asks to change it.
- If behavior changes, make it:
  - intentional
  - described (briefly) near the code
  - verifiable (test or runnable example when applicable)

## 4) Don’t “Fix” Tests Casually
- Don’t edit tests unless the task requires it or the test encodes a wrong spec.
- If something fails, try fixing **implementation first**.
- If you do change tests, state **why** (what spec changed).

—

# Error Handling (Fail Loud, No “Success-Shaped” Failures)
Default stance: a failure must look like a failure. Don’t hide errors behind “empty but valid” outputs.

## 1) Catch only what you can handle
- Avoid broad catches (catch all / except Exception) unless you immediately rethrow.
- Catch specific exception types you expect (I/O, parse errors, network errors).
- If you catch it, you must either:
  - convert it into an explicit error result, or
  - raise with added context (preferred).

## 2) No silent defaults
- Don’t invent fallback values that change behavior without telling anyone.
- If a config value is required for correctness, missing/invalid config must error.
- If a default is acceptable, it must be:
  - explicitly documented near the interface (config schema/docstring), and
  - stable (changing it counts as behavior change -> update docs/tests).

## 3) No “success-shaped” fallbacks
Never return output that looks valid when the step failed, e.g.:
- {}, [], "", placeholder IDs, “OK” status, partial manifests.
- “Use last cached result” unless the feature explicitly calls for it and is documented.

## 4) Errors must be actionable
When failing, include minimal context:
- which step failed (e.g., fetch, parse, chunk, embed)
- target identifiers (URL/path/doc_id/revision_id)
- what was expected vs what was found (brief)

# Last Check (Definition of Done)
This file defines the minimum checks that must pass before a task is considered “done”.

## Required
- Build succeeds locally **or** the project’s standard build command succeeds.
- Tests pass locally **or** the project’s standard test command succeeds.

## When behavior changes
- Add/update tests to cover the new/changed behavior

## If the repository is testless
- Provide at least one of:
  - a runnable example / smoke check command
  - a minimal script that exercises the critical path
  - a documented manual test procedure





## Poetry commands (Windows / PATH + Codex-shell proof)

This repo uses Poetry. In some shells (including some Codex/CI environments) the bare `poetry` command may not be on PATH.

### Preferred (works when Poetry is importable in the active Python)
Try the module form first:
- `python -m poetry --version`
- `python -m poetry install`
- `python -m poetry run pytest`
- `python -m poetry run <cmd>`

### Fallback (works when Poetry is installed as a CLI but not on PATH)
If the module form fails with something like `No module named poetry`, use the CLI form by fixing PATH for the current session:

```powershell
$env:PATH = "$env:APPDATA\Roaming\Python\Python311\Scripts;" + $env:PATH
poetry --version
poetry install
poetry run pytest