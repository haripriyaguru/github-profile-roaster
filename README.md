# 🔥 GitRoast — GitHub Profile Analyzer

A fun, data-driven web app that fetches a GitHub user's profile and delivers a **brutally honest roast** based on their activity, repositories, followers, and coding habits.

---

## Live Demo

> Run locally with `npm run dev` and open [http://localhost:5173](http://localhost:5173)

---

## Features

- **Profile Overview** — Displays avatar, name, username, bio, and a direct link to their GitHub profile.
- **Stats Dashboard** — Shows public repositories, followers, following count, and public gists at a glance.
- **The Roast 🔥** — Generates up to 6 roast cards based on real profile data, covering:
  - Repository count (empty profile vs. active builder)
  - Bio presence (or absence)
  - Follower count and audience size
  - Following-to-follower ratio
  - Public gists activity
  - Language diversity (polyglot vs. one-trick pony)
  - Recent commit activity (still coding or ghost mode?)
- **Language Chart** — Visual progress bars showing the distribution of programming languages across all public repos.
- **Recent Repositories** — Cards for the 6 most recently updated repos, each showing description, primary language, star count, fork count, and last updated date.
- **Quick Search** — One-click buttons to instantly roast well-known GitHub users (`torvalds`, `octocat`, `gaearon`).
- **Input Validation** — Validates username format against GitHub's naming rules before making any API calls.
- **Error Handling** — Clear messages for 404 (user not found), 403 (rate limit exceeded), and other API failures.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [Vite 8](https://vitejs.dev/) | Build tool & dev server |
| [GitHub REST API](https://docs.github.com/en/rest) | Profile & repository data |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) | Fast JavaScript linter |

No external UI libraries or CSS frameworks — all styling is custom CSS.

---

## Project Structure

```
github-profile-roaster/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   └── LanguageChart.jsx   # Language distribution bar chart
│   ├── App.css                 # All app styles
│   ├── App.jsx                 # Main app component (search, roast logic, UI)
│   ├── index.css               # Global/base styles
│   └── main.jsx                # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/github-profile-roaster.git
cd github-profile-roaster

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with hot module replacement.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## How It Works

1. User enters a GitHub username and submits the form.
2. The app validates the username against GitHub's naming pattern (`/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38}[a-zA-Z0-9])?$/`).
3. Two parallel-style API calls are made to the GitHub REST API:
   - `GET /users/{username}` — fetches profile data
   - `GET /users/{username}/repos?per_page=100&sort=updated` — fetches up to 100 repos
4. Language statistics are computed client-side by counting the `language` field across all repos and calculating percentages.
5. The roast engine (`generateRoasts`) runs a series of conditional checks on the profile data and returns up to 6 roast cards with types: `roast`, `warning`, `neutral`, or `good`.
6. Results are rendered — profile card, stats, roast grid, language chart, and recent repositories.

---

## GitHub API Rate Limits

This app uses the **unauthenticated** GitHub API, which allows **60 requests per hour** per IP address. If you hit the rate limit, wait a few minutes and try again.

To increase limits, you can configure a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) and add an `Authorization` header to the fetch calls.

---

## Roast Card Types

| Type | Meaning |
|---|---|
| `roast` | Negative / savage observation |
| `warning` | Something that could be improved |
| `neutral` | Informational, no judgment |
| `good` | Positive observation |

---

## License

MIT — do whatever you want with it.
