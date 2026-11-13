# Baseline Health

Baseline Health is a responsive informational website for an asynchronous mental-health medication refill service. The site is built as an Angular single-page application and includes pages covering the service, treatment areas, supported medications, and frequently asked questions.

## Tech stack

- Angular 22
- TypeScript 6
- Bootstrap 5
- Bootstrap Icons
- RxJS

## Prerequisites

- Node.js `22.22.3`, `24.15.0`, or `26.x`
- npm (included with Node.js)

## Getting started

Install the project dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm start
```

Open `http://localhost:4200` in your browser. The development server reloads the application when source files change.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the Angular development server. |
| `npm run build` | Creates an optimized production build. |
| `npm run watch` | Rebuilds the development bundle when files change. |
| `npm run ng -- <command>` | Runs an Angular CLI command. |

Production build files are written to `dist/baseline-health/browser/` by default.

## Application routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Us |
| `/how-it-works` | How It Works |
| `/what-we-treat` | What We Treat |
| `/medications` | Medications We Offer |
| `/faqs` | Frequently Asked Questions |

Unknown routes redirect to the home page.

## Project structure

```text
public/
  assets/              Static images and locally hosted fonts
src/
  app/
    layout/            Shared header and footer components
    pages/             Lazy-loaded route components
    shared/            Reusable UI components
    app.config.ts      Application providers
    app.routes.ts      Route definitions and page metadata
  scripts/             Site-specific browser behaviors
  styles.css           Global styles and design tokens
  index.html           Application document
  main.ts              Angular bootstrap entry point
```

## Development notes

- Page components are standalone and loaded lazily through the Angular router.
- Page titles and meta descriptions are defined in `src/app/app.routes.ts`.
- Bootstrap CSS, Bootstrap Icons, the Bootstrap JavaScript bundle, and custom site behaviors are registered in `angular.json`.
- Static files placed in `public/` are copied into the build output and are referenced from the application as `/assets/...`.
- No automated test script is currently configured in `package.json`.

## Building for deployment

Create a production build:

```bash
npm run build
```

Deploy the generated files from `dist/baseline-health/browser/` to a static web host. Configure the host to serve `index.html` as the fallback for application routes so that direct visits to paths such as `/about` work correctly.
