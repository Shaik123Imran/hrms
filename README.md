# HRMS

A Human Resource Management System (HRMS) built with React, Vite, Tailwind CSS and a single shared JSON data store. Includes role-protected routes, a global stylesheet, and mock data served from one source of truth.

> **New to the team?** Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup and the daily Git workflow.

## Demo Login

- **Admin** — `admin@hrms.com` / `admin123`
- **HR** — `hr@hrms.com` / `hr123`

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

Other commands:

```bash
npm run build    # production build (outputs to dist/)
npm run lint     # run the linter (fix warnings before pushing)
npm run preview  # preview the production build
```

## Project Structure

```
src/
├── main.jsx                # Entry point
├── App.jsx                 # Root router & providers
├── index.css               # Global stylesheet (all styling is global)
├── components/             # Reusable UI (Button, Card, layout components)
├── context/                # AuthContext (login / logout / session)
├── data/
│   └── data.json           # SINGLE source of truth for the whole app
├── layouts/                # AppLayout wrapper (Sidebar + NavBar + Outlet)
├── pages/                  # Login, Logout, Dashboard, Employees, Attendance, Leaves
├── routes/                 # ProtectedRoute guard
├── services/               # Data service (reads the shared data.json; later a real API)
└── utils/                  # Formatters & helpers
```

## How data flows

- All data (users, departments, employees, attendance, leaves, dashboard) lives in **`src/data/data.json`**.
- Every page fetches through **`src/services/dataService.js`** (async functions, so pages don't change when a real API arrives).
- Mutations (add/edit/delete employee, approve leaves) persist to `localStorage`, seeded from `data.json`.
- Routes are protected — anything under `/` redirects to `/login` unless a valid session exists.

## Contributing

Everyone on the team works on this repo and pushes to `main`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.
