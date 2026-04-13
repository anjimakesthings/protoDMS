# StocketDMS — Ärendehantering

A prototype DMS (Document/Task Management System) for internal circulation workflows at place2place. Built with React, TypeScript, and Vite.

---

## What it does

- **Ärendehantering** — Create, view, and manage transport and general work orders
- **Calendar view** — See scheduled tasks on a monthly/weekly/daily calendar
- **Task list** — Sorted by date, with unscheduled (new) tasks highlighted at the top
- **Filters** — Filter by status, type, assigned person, date range, or freetext search
- **Work item detail** — Full detail view per task with event history

---

## Tech stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Dev server and build tool |
| React Router v6 | Client-side routing |
| React Big Calendar | Calendar component |
| date-fns | Date formatting and locale |
| Tailwind CSS | Utility-first styling |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

```bash
git clone https://github.com/anjimakesthings/protoDMS.git
cd protoDMS
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

Output goes to `dist/`.

---

## Project structure

```
src/
├── assets/          # Static assets (logo, images)
├── components/      # Reusable UI components
│   ├── FilterBar    # Filter row (search, status, type, person, date)
│   ├── WorkItemCard # Individual task card in the list
│   ├── WorkItemList # Sorted/grouped task list
│   ├── WorkItemModal# Create / edit task modal
│   └── StatusBadge  # Coloured status pill
├── context/
│   └── AppContext   # Global state (work items, users, filters)
├── data/
│   └── mockData     # Placeholder tasks and users
├── pages/
│   ├── CalendarListView  # Main view: task list + calendar
│   └── WorkItemDetail    # Full detail page for a single task
├── types/
│   └── index.ts     # Shared TypeScript types and config maps
├── App.tsx          # App shell, routing, top nav
└── index.css        # Global styles and Tailwind overrides
```

---

## Data model

All data is currently held in memory (no backend). The core type is `WorkItem`:

```ts
type WorkItemStatus = 'CREATED' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
type WorkItemType   = 'TRANSPORT' | 'GENERAL'

interface WorkItem {
  id: string
  type: WorkItemType
  status: WorkItemStatus
  title: string
  description: string
  reference: string | null      // order number or freetext
  assignedToUserId: string | null
  scheduledDate: string | null
  transport?: {
    pickupAddress: string
    deliveryAddress: string
    transportType: string
  }
  actions: WorkItemAction[]
  events: WorkItemEvent[]       // audit log
  createdAt: string
  updatedAt: string
}
```

---

## Notes for designers

- The design targets a **1440px+** viewport
- Colors and spacing use Tailwind utilities with inline overrides for brand colours (`#fec301` yellow, `#111827` near-black)
- The calendar is `react-big-calendar` — toolbar styles are overridden in `index.css` under `/* CALENDAR OVERRIDES */`
- The brand logo lives in `src/assets/`

## Notes for developers

- State lives entirely in `AppContext` — no external store or backend yet
- Mock data is in `src/data/mockData.ts` and is regenerated relative to the current week on each page load
- To add a new filter, add the field to `AppState` in `AppContext`, wire up a setter, apply it in `filteredWorkItems`, then add the UI control in `FilterBar`
- Routes: `/` → Ärendehantering, `/ordrar` → empty placeholder, `/arenden/:id` → detail view
