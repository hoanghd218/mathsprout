# Plan: Migrate MathSprout to React 19 + Tailwind CSS v4

> Convert vanilla HTML/CSS/JS app to a Vite + React 19 + Tailwind CSS v4 SPA
> while preserving all v1.0 features, claymorphism design, and bilingual UX.

## Overview

| | |
|---|---|
| Source | 1 HTML (377L) + 6 JS (1131L) + 1 CSS (583L) — 2091 lines total |
| Target | Vite + React 19 + Tailwind CSS v4 + JavaScript (JSX) |
| Pages | 8: welcome, signup, dashboard, practice, result, skillmap, progress, achievements, settings |
| State | Context API + useReducer + localStorage sync |
| Routing | React Router v7 (BrowserRouter) |
| Styling | Tailwind v4 utilities + preserved claymorphism CSS in index.css |

## Tech Stack Decisions

- **JavaScript not TypeScript** — match original simplicity, kid-author friendly
- **Vite** — fastest, official React 19 template
- **Tailwind v4** — latest, CSS-first config via `@theme`
- **React Router v7** — browser back/forward, clean URLs
- **canvas-confetti** — npm package (replaces CDN)
- **Context + useReducer** — no Zustand/Redux needed for this size
- **Preserve claymorphism CSS** — full design system stays in `src/index.css`

## Phases

| # | Phase | Status | Files |
|---|---|---|---|
| 1 | [Project setup](phase-01-setup.md) | ⏳ Pending | package.json, vite.config.js, index.html, src/main.jsx, src/index.css |
| 2 | [Port pure logic](phase-02-port-logic.md) | ⏳ Pending | src/data/, src/lib/ |
| 3 | [State + storage](phase-03-state.md) | ⏳ Pending | src/context/AppContext.jsx |
| 4 | [UI primitives](phase-04-ui-primitives.md) | ⏳ Pending | src/components/ui/ |
| 5 | [Pages](phase-05-pages.md) | ⏳ Pending | src/pages/*.jsx |
| 6 | [Routing + App shell](phase-06-app.md) | ⏳ Pending | src/App.jsx, router |
| 7 | [Cleanup + docs](phase-07-cleanup.md) | ⏳ Pending | Remove old files, update README |

## Target Structure (kebab-case per project CLAUDE.md)

```
mathsprout/
├── package.json                  # Vite + React 19 deps
├── vite.config.js                # Vite + Tailwind v4 plugin
├── index.html                    # Vite entry (root <div id="root">)
├── public/                       # Static assets
├── src/
│   ├── main.jsx                  # React entry
│   ├── app.jsx                   # Router + AppProvider
│   ├── index.css                 # Tailwind + claymorphism design system
│   ├── data/
│   │   └── topics.js             # TOPICS, LEVELS, BADGES, NAMES, ITEMS, WORD_PROBLEMS, VOCABULARY
│   ├── lib/
│   │   ├── generators.js         # Question generators
│   │   ├── recommender.js        # Adaptive learning engine
│   │   ├── storage.js            # localStorage helpers
│   │   ├── celebrate.js          # canvas-confetti wrapper
│   │   └── speech.js             # Web Speech API wrapper
│   ├── context/
│   │   └── app-context.jsx       # Context + useReducer + localStorage sync
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.jsx        # BtnPrimary, BtnSecondary, ChoiceBtn, IconBtn, PillBtn, BackButton
│   │   │   ├── input.jsx
│   │   │   └── toast.jsx         # ToastProvider + useToast
│   │   └── layout/
│   │       └── page-header.jsx   # Back button + title pattern
│   └── pages/
│       ├── welcome-page.jsx
│       ├── signup-page.jsx
│       ├── dashboard-page.jsx
│       ├── practice-page.jsx
│       ├── result-page.jsx
│       ├── skill-map-page.jsx
│       ├── progress-page.jsx
│       ├── achievements-page.jsx
│       └── settings-page.jsx
└── README.md                     # Updated with new run instructions
```

> Components inside files still use `PascalCase` per React convention (e.g. `export function Button()`).
> Filenames use kebab-case so Grep/Glob results are self-documenting.

## Routes

| Path | Component | Auth |
|---|---|---|
| `/` | WelcomePage | No user |
| `/signup` | SignupPage | No user |
| `/dashboard` | DashboardPage | User required |
| `/practice` | PracticePage | User + currentLesson |
| `/result` | ResultPage | After submit |
| `/skill-map` | SkillMapPage | User required |
| `/progress` | ProgressPage | User required |
| `/achievements` | AchievementsPage | User required |
| `/settings` | SettingsPage | User required |

## State Shape (Unchanged from v1)

```js
{
  user: { nickname, age, grade, avatar, createdAt } | null,
  progress: { totalXP, streakDays, lastActiveDate },
  skillMap: { addition, subtraction, multiplication, division: { mastery, attempts, correct } },
  attempts: [],          // capped at 500
  badges: [],            // string codes
  settings: { bilingualMode, voiceReading, soundVolume, theme },
  bilingualUseCount: 0,
  currentLesson: null
}
```

## Key Dependencies

```
react@19, react-dom@19
react-router@7
canvas-confetti@1.9
tailwindcss@4, @tailwindcss/vite@4
vite@6, @vitejs/plugin-react@4
```

## Migration Strategy

1. **Set up new project structure alongside old** — keep old files until phase 7
2. **Port logic verbatim** — generators, recommender, data are pure functions, drop straight in
3. **Preserve CSS classes** — `.btn-primary`, `.choice-btn`, `.clay-card`, `.mascot`, etc. all stay
4. **Wrap class-based UI in components** — `<Button variant="primary">` → emits `className="btn-primary"`
5. **Test feature-by-feature** — verify each page works in browser after porting
6. **Delete old files in phase 7** — index.html (replaced), css/, js/

## Success Criteria

- `npm run dev` opens functional app at localhost
- All 8 pages render and navigate correctly
- Signup → Dashboard → Practice → Result → Dashboard flow works
- localStorage state persists across reloads
- Speech, confetti, bilingual toggle, hint, badges all functional
- `npm run build` produces production bundle
- Visual design matches v1 (claymorphism intact)

## Risks

| Risk | Mitigation |
|---|---|
| Tailwind v4 syntax changes | Use `@import "tailwindcss"` + keep utilities in JSX |
| React 19 strict mode double-invocation | Avoid side effects in render; use useEffect properly |
| LocalStorage key compatibility | Keep key `mathsprout_v1` so existing users don't lose data |
| CSS scoping conflicts | Keep custom CSS as global classes (no CSS modules) |

## Out of Scope (Per YAGNI)

- TypeScript migration
- PWA / service worker
- Test suite (no tests in v1)
- Component library (shadcn, Headless UI)
- State libs (Zustand, Redux)
- Advanced bundling (code splitting)

## Open Questions

1. Should we keep the legacy `mathsprout_v1` localStorage key to preserve existing user data? **Default: yes**
2. JS or TS? **Default: JS (matches original)**
3. Use BrowserRouter (clean URLs, needs server config) or HashRouter (works on file://)? **Default: BrowserRouter** — typical Vite deploys to static hosts that support SPA routing
