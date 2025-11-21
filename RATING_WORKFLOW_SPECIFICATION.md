# Specification: Presentation Rating Workflow

**TL;DR** — Implement a frontend-only skeleton for a 5-step rating flow (login → waiting room → overview → rating → thanks). The spec below is an actionable developer checklist: exact files to add/update, UI text and layout, component APIs, local state shape, TODO header text for future API wiring, acceptance criteria, and test cases. No backend/hook/cookie code is required now — all network integration points are clearly marked.

## Goals

- Provide a clear, implementable skeleton matching the requested UX.
- Reuse existing `InputRating.tsx`.
- Show `confeedlogo.svg` on every page.
- Preserve local state when navigating/editing.
- Add MenuBar/Sidebar links to entry points.
- Add explicit TODOs describing how/where to connect backend hooks later.

## User Stories

- As a user I enter my personal code and proceed to a waiting room.
- When a presentation becomes active, I am redirected to overview.
- I see presenter & topic, then enter ratings for three categories (Content, Style, Slides) using 1–5 stars.
- I submit ratings and see a thank-you page with an Edit button that will later load saved votes and restore star states.

## Files To Add / Edit

### Add pages (new files):
- `frontend/src/pages/RateLogin.tsx`
- `frontend/src/pages/RateWaitingRoom.tsx`
- `frontend/src/pages/RateOverview.tsx`
- `frontend/src/pages/RatePresentation.tsx`
- `frontend/src/pages/RateThanks.tsx`

### Add optional context:
- `frontend/src/context/RatingContext.tsx`

### Edit routing/menu:
- `frontend/src/App.tsx` (or the project's central router) — register new routes
- `frontend/src/common/TopMenuBar.tsx` — add link(s)
- `frontend/src/common/Sidebar.tsx` — add link(s)

## High-level Routes

- `/rate/login` — `RateLogin`
- `/rate/wait/:presentationId?` — `RateWaitingRoom`
- `/rate/overview/:presentationId?` — `RateOverview`
- `/rate/presentation/:presentationId` — `RatePresentation`
- `/rate/thanks` — `RateThanks`

---

## Page-by-page Specification

### RateLogin (`frontend/src/pages/RateLogin.tsx`)

**Layout:**
- Top: `confeedlogo.svg` (use existing asset import path).
- Body: single input labeled "Personal Code".
- Submit button: "Enter".

**Behavior:**
- Local input validation: non-empty.
- On submit: store `userCode` in local context and navigate to `/rate/wait/:presentationId?`.
- No API call. Add header TODO comment: where to call `useUserVerify(userCode)` later.

**TODO header comment (exact suggested text at top of file):**
```typescript
// TODO: Replace local verify with generated hook e.g. useAuthVerifyUserCode(userCode).
```

**Accessibility:**
- `aria-label="Personal Code"`, input `autoComplete="off"`.

---

### RateWaitingRoom (`frontend/src/pages/RateWaitingRoom.tsx`)

**Layout:**
- Top: `confeedlogo.svg`
- Center text: `Please wait until admin opens the feedback`

**Behavior:**
- Local boolean `isActive` (starts `false`).
- A visible hint or spinner while waiting.
- Auto-redirect: when `isActive` becomes `true`, navigate to `/rate/overview/:presentationId`.
- Implementation detail: provide a debug toggle (local button) to set `isActive = true` during dev.

**Integration points:**
- Add comment: `// TODO: Poll backend or subscribe via SSE/WebSocket to detect active presentation (replace local toggle).`
- If `presentationId` present in URL, pass it to overview navigation.

**Notes:**
- Poll stub should be commented and explain recommended interval (e.g., 5–10s).

---

### RateOverview (`frontend/src/pages/RateOverview.tsx`)

**Layout:**
- Top: `confeedlogo.svg`
- Text: `now voting for:`
- Presenter Name (placeholder: `Presenter Name`)
- Presentation Topic (placeholder: `Presentation Topic`)
- Button: `Enter Feedback` — navigates to `/rate/presentation/:presentationId`

**Data:**
- Presenter and topic initially from `RatingContext` or URL params.
- TODO header: `// TODO: Use presentation fetch hook e.g. usePresentationFindOne(presentationId).`

**Auto-skip:**
- If a later backend integration indicates `ratingReleased` or `isActive`, redirect automatically to `/rate/presentation/:presentationId`.

---

### RatePresentation (`frontend/src/pages/RatePresentation.tsx`)

**Layout:**
- Top: `confeedlogo.svg`
- Three labeled sections (vertical stack):
  - `Content` — `InputRating` (1–5)
  - `Style` — `InputRating` (1–5)
  - `Slides` — `InputRating` (1–5)
- Submit Button: `Send Feedback`

**Behavior:**
- Each `InputRating` controlled by local state in either this page or `RatingContext`.
- On submit:
  - Save ratings to `RatingContext` (persist locally).
  - Navigate to `/rate/thanks`.
  - Add TODO: `// TODO: call createRating mutation e.g. useRatingCreate({ presentationId, content, style, slides, userCode }).`

**Accessibility:**
- Provide `aria-label` for each rating block (e.g., `aria-label="Content rating"`).

**Component API (how to use InputRating):**
- Suggested props:
  - `value: number` (1–5)
  - `onChange: (value:number) => void`
  - `readOnly?: boolean`
  - `id?: string`
- If `InputRating` has different API, adapt accordingly; include a thin wrapper if needed.

---

### RateThanks (`frontend/src/pages/RateThanks.tsx`)

**Layout:**
- Top: `confeedlogo.svg`
- Text: `Thanks for Voting`
- Button: `Edit`

**Behavior:**
- `Edit` navigates back to `/rate/presentation/:presentationId`.
- TODO: On mount, later implementation will fetch saved votes and repopulate `RatingContext`.
  - Add header: `// TODO: load saved votes via useRatingFindByUserOrPresentation(...) and set context.`

---

## State Management

**Add RatingContext** (optional but recommended) at `frontend/src/context/RatingContext.tsx`:

**Exports:**
- `RatingProvider` component
- `useRatingContext()` hook

**State shape (TypeScript style):**
```typescript
interface RatingState {
  userCode?: string;
  presentationId?: string;
  presenterName?: string;
  presentationTopic?: string;
  ratings: { content?: number; style?: number; slides?: number };
}
```

**Actions:**
- `setUserCode(string)`
- `setPresentationId(string)`
- `setPresenterInfo({name, topic})`
- `setRating(category, value)`
- `clearRatings()`

**Rationale:**
- Centralized state makes back-and-forth navigation preserve inputs.
- Replace or hydrate from backend later when hooks exist.

---

## MenuBar & Sidebar

**Files to update:**
- `frontend/src/common/TopMenuBar.tsx` — add a menu item:
  - Label: `Rate Presentation`
  - Link: `/rate/login`
- `frontend/src/common/Sidebar.tsx` — add a sidebar entry:
  - Label: `Rate Presentation`
  - Link: `/rate/login`

**Implementation note:**
- Keep links visible to Admins/Users depending on existing roles — if menu currently filters by role, add to public section or mirror existing pattern.

---

## Integration Points (TODOs & Expected Hook Names / Payloads)

**Where to add TODO headers:**
- Each new page top: small block explaining expected future hooks and payload examples.

**Suggested future hook names (consistent with generated hooks pattern):**
- `usePresentationPresentationControllerFindOne(presentationId)` — returns `{ id, title, presenterName, isActive }`
- `useRatingRatingControllerCreate()` — takes `{ presentationId, userCode, content, style, slides }`
- `useRatingRatingControllerFindByUserOrPresentation()` — to load saved ratings for Edit flow
- `useAuthAuthControllerVerifyUserCode()` — to validate `userCode`

**Example future request payload (JSON):**
- Create rating:
  ```json
  { "presentationId": "uuid", "userCode": "ABC123", "content": 4, "style": 5, "slides": 3 }
  ```
- Presentation response:
  ```json
  { "id": "uuid", "presenterName": "Jane Doe", "title": "How to TWP", "isActive": true }
  ```

**Cookie/auth note:**
- When integrating backend, update `frontend/src/api/generate/core/OpenAPI.ts` to set `WITH_CREDENTIALS: true`.

---

## Accessibility

- Inputs: label and `aria-label`.
- Buttons: `aria-pressed` where appropriate; `type="button"` on non-submit controls.
- Visual focus indicators for keyboard navigation.
- Screen-reader friendly text for star control (e.g., "3 of 5 stars for Content").

---

## Acceptance Criteria

**Navigation:**
- From `/rate/login` entering a non-empty code navigates to `/rate/wait/:presentationId?`.
- Developer toggle in waiting room immediately navigates to `/rate/overview/:presentationId`.
- `Enter Feedback` leads to `/rate/presentation/:presentationId`.

**Ratings:**
- Each category uses `InputRating` and stores its value in context/state.
- `Send Feedback` navigates to `/rate/thanks` and values persist to `RatingContext`.
- `Edit` returns to `/rate/presentation` with the same star values restored from context.

**UI:**
- `confeedlogo.svg` visible on every page.
- All pages show specified text exactly (see page specs).
- No network calls are made in this skeleton (verify via devtools/network or code review).

---

## Developer Checklist (Step-by-step Implementation Tasks)

1. **Add context file:**
   - Create `frontend/src/context/RatingContext.tsx`.
   - Implement `RatingProvider` with the state shape above and `useRatingContext()` hook.
   - Wrap the App root (in `frontend/src/main.tsx` or equivalent) with `RatingProvider`.

2. **Create page components:**
   - For each of the five pages, add the file under `frontend/src/pages/` with the layout and TODO header text (see Page-by-page Spec).
   - Import `confeedlogo.svg` the same way existing pages do (inspect an existing page for the exact import pattern).
   - Use React Router `useNavigate()` for navigation.
   - Use `useRatingContext()` to read/write `userCode`, `presentationId`, presenter info, and ratings.
   - Add a local debug toggle/button in `RateWaitingRoom` to set `isActive` true.

3. **Reuse InputRating:**
   - In `RatePresentation.tsx`, import `frontend/src/components/InputRating.tsx`.
   - Wire three instances to context or local state and ensure `onChange` writes to context.
   - If `InputRating` API differs, write a small wrapper component in the same file to adapt props.

4. **Register routes:**
   - Edit `frontend/src/App.tsx` (or router file) — add routes shown in "High-level Routes".
   - Ensure routes are reachable — add a test link or use TopMenuBar.

5. **Update TopMenuBar & Sidebar:**
   - Add link entries pointing to `/rate/login`.
   - Follow existing component style and role-based visibility patterns.

6. **Add TODO headers & payload examples in each page:**
   - At top of each new file, paste the suggested `// TODO:` comments from "Integration Points".

7. **Add tests or manual QA steps:**
   - Manually verify navigation, local state preservation, and the presence of `confeedlogo.svg`.

8. **Commit changes in a single logical commit:** 
   - `"feat(rate): add rating flow skeleton (login, waiting, overview, presentation, thanks)"`

---

## Testing / QA

**Manual test cases:**
- Enter code -> waiting room -> toggle active -> overview -> enter feedback -> send -> thanks -> edit -> check ratings persisted.
- Verify `confeedlogo.svg` on all pages.
- Keyboard-only navigation: tab through inputs and buttons.

**Optional automated tests (future):**
- Component/unit tests for `RatingContext` actions.
- E2E test (Cypress) simulating the user flow (with debug toggle).

---

## Notes & Future Work

- Replace local toggles/polls with real-time server push or generated hooks when backend exists.
- When wiring backend hooks, make sure `OpenAPI.ts` is configured `WITH_CREDENTIALS: true` to send cookies for auth.
- Consider storing temporary ratings in `localStorage` to survive page reloads until backend persistence implemented.
