# Schedule Job Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build schedule job management in `apps/web-ele` with task CRUD, enable/disable, execute-now, and per-job log viewing from a drawer, aligned with the `sephy-app` `SysScheduleJobController` contract.

**Architecture:** Follow the existing system-module pattern already used in `apps/web-ele`: API contract in `src/api/system`, route registration in `src/router/routes/modules/system.ts`, view state in `views/system/schedule-job/data.ts`, page orchestration in `list.vue`, and focused UI modules for the form and log drawer. Keep front-end editing behavior strict to the backend contract, and treat `jobParams` as validated JSON text that is converted to/from objects at the boundary.

**Tech Stack:** Vue 3, TypeScript, Element Plus, Vben modal/drawer/grid adapters, Vue Router, project i18n JSON locales

---

### Task 1: Confirm backend status contract and API surface

**Files:**
- Check: `/Users/sephy/workspace/top.sephy/sephy-app/infra-system/infra-system-serv/src/main/java/top/sephy/infra/system/controller/admin/SysScheduleJobController.java`
- Check: `/Users/sephy/workspace/top.sephy/sephy-app/infra-system/infra-system-serv/src/main/java/top/sephy/infra/system/dto/SysScheduleJobDTO.java`
- Check: `/Users/sephy/workspace/top.sephy/sephy-app/infra-system/infra-system-serv/src/main/java/top/sephy/infra/system/dto/SysScheduleJobLogDTO.java`
- Check: `/Users/sephy/workspace/top.sephy/sephy-app/infra-system/infra-system-serv/src/main/java/top/sephy/infra/system/dto/cmd/CreateScheduleJobCmd.java`
- Check: `/Users/sephy/workspace/top.sephy/sephy-app/infra-system/infra-system-serv/src/main/java/top/sephy/infra/system/dto/cmd/UpdateScheduleJobCmd.java`
- Check: `/Users/sephy/workspace/top.sephy/sephy-app/infra-system/infra-system-serv/src/main/java/top/sephy/infra/system/dto/query/ScheduleJobQuery.java`

**Step 1: Verify backend field types before front-end work**

Confirm that `jobStatus` is already updated to string values `ENABLED` / `DISABLED` in DTOs, query objects, and create command objects.

**Step 2: Verify log list endpoint shape**

Confirm `POST /admin-api/schedule/job/log/list` accepts paging plus `jobId` and does not require extra filters.

**Step 3: Record any contract mismatch**

If backend still returns numeric status or a different field name, stop implementation and update the design/plan first.

**Step 4: Commit if backend contract docs changed**

```bash
git add docs/plans/2026-03-05-schedule-job-management-design.md docs/plans/2026-03-05-schedule-job-management-implementation.md
git commit -m "docs: refine schedule job contract notes"
```

### Task 2: Add failing API contract tests or smoke checks

**Files:**
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/api/system/__tests__/schedule-job.spec.ts`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/api/system/dict.ts`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/api/request.ts`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/package.json`

**Step 1: Write the failing test**

Add a focused test file that asserts:

- list query posts to `/admin-api/schedule/job/list` and transforms paging data
- create/update payloads serialize `jobParams` as objects
- enable/disable/delete/execute send `id` as request params
- log list sends `jobId` with paging

Example skeleton:

```ts
import { describe, expect, it, vi } from 'vitest';

describe('schedule-job api', () => {
  it('posts list queries to the schedule job endpoint', async () => {
    expect(true).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest apps/web-ele/src/api/system/__tests__/schedule-job.spec.ts`

Expected: FAIL because the module or assertions are not implemented yet.

**Step 3: Implement the API module minimally**

Create `schedule-job.ts` with the exact exported functions needed by the test.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest apps/web-ele/src/api/system/__tests__/schedule-job.spec.ts`

Expected: PASS with the new API wrappers.

**Step 5: Commit**

```bash
git add apps/web-ele/src/api/system/schedule-job.ts apps/web-ele/src/api/system/__tests__/schedule-job.spec.ts
git commit -m "feat: add schedule job api client"
```

### Task 3: Implement schedule job API types and exports

**Files:**
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/api/system/schedule-job.ts`
- Modify: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/api/system/index.ts`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/api/types.ts`

**Step 1: Define the TypeScript namespaces and interfaces**

Add:

- `ScheduleJobApi.ScheduleJob`
- `ScheduleJobApi.ScheduleJobLog`
- `ScheduleJobApi.QueryScheduleJobParams`
- `ScheduleJobApi.CreateScheduleJobParams`
- `ScheduleJobApi.UpdateScheduleJobParams`

**Step 2: Implement list and detail methods**

Add wrappers for:

- `queryScheduleJobs`
- `getScheduleJob`
- `queryScheduleJobLogs`

**Step 3: Implement mutation methods**

Add wrappers for:

- `createScheduleJob`
- `updateScheduleJob`
- `deleteScheduleJob`
- `enableScheduleJob`
- `disableScheduleJob`
- `executeScheduleJob`

**Step 4: Export the module from the system API barrel**

Ensure `apps/web-ele/src/api/system/index.ts` re-exports the new module consistently with neighboring system APIs.

**Step 5: Run targeted checks**

Run: `pnpm eslint apps/web-ele/src/api/system/schedule-job.ts apps/web-ele/src/api/system/index.ts`

Expected: PASS

**Step 6: Commit**

```bash
git add apps/web-ele/src/api/system/schedule-job.ts apps/web-ele/src/api/system/index.ts
git commit -m "feat: expose schedule job api"
```

### Task 4: Add locale entries for schedule jobs

**Files:**
- Modify: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/locales/langs/zh-CN/system.json`
- Modify: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/locales/langs/en-US/system.json`

**Step 1: Add the failing locale usage**

Reference new locale keys from the upcoming schedule-job page and data schema before adding them to both locale files.

**Step 2: Run a quick type/build check**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job`

Expected: FAIL because the files or keys do not exist yet.

**Step 3: Add locale keys**

Add grouped keys for:

- page title and menu title
- field labels
- status labels
- action labels such as execute/log/detail
- log drawer strings
- validation messages that are specific to JSON input

**Step 4: Run locale lint or formatter if the repo uses one**

Run: `pnpm eslint apps/web-ele/src/locales/langs/zh-CN/system.json apps/web-ele/src/locales/langs/en-US/system.json`

Expected: PASS or skip if JSON lint is covered elsewhere.

**Step 5: Commit**

```bash
git add apps/web-ele/src/locales/langs/zh-CN/system.json apps/web-ele/src/locales/langs/en-US/system.json
git commit -m "feat: add schedule job locales"
```

### Task 5: Register the schedule job route

**Files:**
- Modify: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/router/routes/modules/system.ts`

**Step 1: Add the failing route reference**

Insert a new child route pointing at `#/views/system/schedule-job/list.vue`.

**Step 2: Run route-level check**

Run: `pnpm eslint apps/web-ele/src/router/routes/modules/system.ts`

Expected: FAIL until the imported component path exists.

**Step 3: Implement the route metadata**

Use:

- path: `/system/schedule-job`
- name: `SystemScheduleJob`
- title locale key from `system.scheduleJob.title`
- suitable icon
- authority: `system:schedule-job:view`

**Step 4: Re-run the route check**

Run: `pnpm eslint apps/web-ele/src/router/routes/modules/system.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/web-ele/src/router/routes/modules/system.ts
git commit -m "feat: register schedule job route"
```

### Task 6: Build the view schema and formatter helpers

**Files:**
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/data.ts`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/dict/data.ts`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/user/data.ts`

**Step 1: Write the failing consumer usage**

Create the data module with exported placeholders for:

- `useGridFormSchema`
- `useColumns`
- `useFormSchema`
- `useLogColumns`
- status-option helpers
- JSON parse/format helpers

**Step 2: Run typecheck**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/data.ts`

Expected: FAIL if helper signatures or imports are incomplete.

**Step 3: Implement the schema**

Include:

- search fields: `jobName`, `beanName`, `jobStatus`
- form fields split by mode (create/edit)
- table columns with status rendering and operation column support
- log table columns with summary/detail action slot support

**Step 4: Implement JSON boundary helpers**

Add small pure helpers for:

- converting API `jobParams` object to formatted text
- validating/parsing text to object before submit
- returning a friendly error message for invalid JSON object input

**Step 5: Re-run lint**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/data.ts`

Expected: PASS

**Step 6: Commit**

```bash
git add apps/web-ele/src/views/system/schedule-job/data.ts
git commit -m "feat: add schedule job view schemas"
```

### Task 7: Build the create/edit form component

**Files:**
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/modules/form.vue`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/dict/modules/type-form.vue`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/user/modules/form.vue`

**Step 1: Write the failing form behavior**

Implement the shell modal wiring first, with props/data handling for create vs edit mode, but leave submit behavior unimplemented.

**Step 2: Run targeted lint**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/modules/form.vue`

Expected: FAIL until submit logic and schema wiring are complete.

**Step 3: Implement minimal submit behavior**

Support:

- create mode calling `createScheduleJob`
- edit mode calling `updateScheduleJob`
- `jobParams` JSON validation before request
- read-only fields in edit mode for `jobName`, `beanName`, `jobStatus`

**Step 4: Emit success and close the modal**

Match existing system module modal conventions so the parent page can refresh the grid.

**Step 5: Re-run lint**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/modules/form.vue`

Expected: PASS

**Step 6: Commit**

```bash
git add apps/web-ele/src/views/system/schedule-job/modules/form.vue
git commit -m "feat: add schedule job form modal"
```

### Task 8: Build the log drawer and log detail view

**Files:**
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/modules/log-drawer.vue`
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/modules/log-detail-modal.vue`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/dict/modules/item-drawer.vue`

**Step 1: Write the failing drawer structure**

Create a drawer component that accepts the current job id and job name but does not yet fetch data.

**Step 2: Run targeted lint**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/modules/log-drawer.vue apps/web-ele/src/views/system/schedule-job/modules/log-detail-modal.vue`

Expected: FAIL until table wiring and detail behavior are added.

**Step 3: Implement log paging**

Use the grid adapter to query `queryScheduleJobLogs` with:

- current page
- page size
- `jobId`

Reset to page 1 each time a different task opens the drawer.

**Step 4: Implement summary/detail behavior**

Show shortened text in the table and open a read-only modal for full `executeResult` or `errorMessage`.

**Step 5: Handle close/reset state**

Clear the active job context when the drawer closes.

**Step 6: Re-run lint**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/modules/log-drawer.vue apps/web-ele/src/views/system/schedule-job/modules/log-detail-modal.vue`

Expected: PASS

**Step 7: Commit**

```bash
git add apps/web-ele/src/views/system/schedule-job/modules/log-drawer.vue apps/web-ele/src/views/system/schedule-job/modules/log-detail-modal.vue
git commit -m "feat: add schedule job log drawer"
```

### Task 9: Build the schedule job list page

**Files:**
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/list.vue`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/dict/list.vue`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/role/list.vue`

**Step 1: Write the failing page shell**

Create the page with modal and drawer containers plus a grid instance, but leave action handlers stubbed.

**Step 2: Run targeted lint**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/list.vue`

Expected: FAIL until the event handlers are implemented.

**Step 3: Implement query behavior**

Wire the grid to `queryScheduleJobs` and the search schema from `data.ts`.

**Step 4: Implement row actions**

Add handlers for:

- create
- edit
- delete
- enable
- disable
- execute now
- open logs

Each mutation should confirm first, call the API, and refresh the grid on success.

**Step 5: Implement status safety**

Disable enable/disable controls for unknown statuses.

**Step 6: Re-run lint**

Run: `pnpm eslint apps/web-ele/src/views/system/schedule-job/list.vue`

Expected: PASS

**Step 7: Commit**

```bash
git add apps/web-ele/src/views/system/schedule-job/list.vue
git commit -m "feat: add schedule job management page"
```

### Task 10: Add component-level tests for JSON validation and status handling

**Files:**
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/__tests__/data.spec.ts`
- Create: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/__tests__/form.spec.ts`
- Reference: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system`

**Step 1: Write the failing tests**

Cover:

- valid JSON object parses correctly
- invalid JSON fails with a useful error
- non-object JSON is rejected
- unknown `jobStatus` falls back safely

**Step 2: Run tests to verify failure**

Run: `pnpm vitest apps/web-ele/src/views/system/schedule-job/__tests__/data.spec.ts apps/web-ele/src/views/system/schedule-job/__tests__/form.spec.ts`

Expected: FAIL until helpers or component logic are complete.

**Step 3: Implement minimal fixes**

Adjust `data.ts` or `form.vue` only as needed to satisfy the test cases.

**Step 4: Run tests to verify pass**

Run: `pnpm vitest apps/web-ele/src/views/system/schedule-job/__tests__/data.spec.ts apps/web-ele/src/views/system/schedule-job/__tests__/form.spec.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/web-ele/src/views/system/schedule-job/__tests__/data.spec.ts apps/web-ele/src/views/system/schedule-job/__tests__/form.spec.ts apps/web-ele/src/views/system/schedule-job/data.ts apps/web-ele/src/views/system/schedule-job/modules/form.vue
git commit -m "test: cover schedule job validation rules"
```

### Task 11: Run integration verification for the new module

**Files:**
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/api/system/schedule-job.ts`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/list.vue`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/modules/form.vue`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/views/system/schedule-job/modules/log-drawer.vue`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/apps/web-ele/src/router/routes/modules/system.ts`

**Step 1: Run focused lint**

Run: `pnpm eslint apps/web-ele/src/api/system/schedule-job.ts apps/web-ele/src/views/system/schedule-job apps/web-ele/src/router/routes/modules/system.ts`

Expected: PASS

**Step 2: Run focused tests**

Run: `pnpm vitest apps/web-ele/src/api/system/__tests__/schedule-job.spec.ts apps/web-ele/src/views/system/schedule-job/__tests__/data.spec.ts apps/web-ele/src/views/system/schedule-job/__tests__/form.spec.ts`

Expected: PASS

**Step 3: Run project typecheck or the smallest equivalent app check**

Run: `pnpm --filter web-ele typecheck`

Expected: PASS

**Step 4: Record any gaps**

If no UI harness exists for full interaction tests, note that manual verification is still needed for:

- modal open/close flows
- log drawer pagination
- live backend permission behavior

**Step 5: Commit**

```bash
git add apps/web-ele/src/api/system apps/web-ele/src/views/system/schedule-job apps/web-ele/src/router/routes/modules/system.ts apps/web-ele/src/locales/langs/zh-CN/system.json apps/web-ele/src/locales/langs/en-US/system.json
git commit -m "feat: complete schedule job management module"
```

### Task 12: Final manual verification and handoff notes

**Files:**
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/docs/plans/2026-03-05-schedule-job-management-design.md`
- Check: `/Users/sephy/workspace/top.sephy/vue-vben-admin/docs/plans/2026-03-05-schedule-job-management-implementation.md`

**Step 1: Start the target app**

Run: `pnpm --filter web-ele dev`

Expected: local dev server starts successfully.

**Step 2: Manually verify the schedule job page**

Check:

- route is visible with expected authority
- grid loads and filters correctly
- create/edit submit payloads are correct
- enable/disable/execute/delete all refresh the grid
- log drawer resets when switching jobs
- detail modal shows full log content

**Step 3: Save follow-up notes if needed**

Document any backend dependency, such as missing string status support or missing seed data, before merging.

**Step 4: Commit only if handoff docs changed**

```bash
git add docs/plans/2026-03-05-schedule-job-management-design.md docs/plans/2026-03-05-schedule-job-management-implementation.md
git commit -m "docs: finalize schedule job implementation notes"
```
