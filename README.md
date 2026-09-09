# HRMS

A Human Resource Management System (HRMS). This repo currently contains only the **project skeleton and `App.jsx`** — the rest of the app will be built by the team.

> **New to the team?** Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup and the daily Git workflow.

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
├── components/
│   ├── common/             # Reusable UI (Button, Modal, Toast, ...)
│   ├── employee/           # Employee form, etc.
│   └── layout/             # Sidebar & Navbar
├── context/                # Global state (auth, toasts, ...)
├── data/                   # Mock data (employees, leaves, attendance, ...)
├── layouts/                # App layout wrapper
├── pages/                  # Route pages (Login, Dashboard, Employees, ...)
├── routes/                 # Route guards
├── services/               # Data services (localStorage, later real API)
└── utils/                  # Constants, formatters, validators, helpers
```

## Contributing

Everyone on the team works on this repo and pushes to `main`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.
