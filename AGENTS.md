# Agent Rules

## Test File Placement

- Never create `*.spec.*` or `*.test.*` files inside any path covered by runtime `import.meta.glob(...)`.
- Before adding tests near router or view code, first inspect glob patterns with:
  - `rg -n "import.meta.glob\\(" apps/web-ele/src`
- If test files must be colocated near runtime code, ensure runtime globs explicitly exclude test files.

## Pre-Completion Check

- Before finishing work, run a runtime test-leak scan:
  - `rg -n "from 'vitest'|\\bdescribe\\(|\\bit\\(" apps/web-ele/src/router/routes/modules apps/web-ele/src/views`
- Any hit in runtime-loaded directories must be fixed before completion.
