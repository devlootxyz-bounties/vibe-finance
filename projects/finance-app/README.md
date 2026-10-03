# Finance App

A browser-based personal expense tracker built with React, TypeScript and Vite.

## Run locally

Use Node.js 22.12 or newer and npm. From `projects/finance-app`:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm run build` checks TypeScript and builds the production assets; `npm run preview` serves that build. `npm run lint` runs ESLint.

## Current behavior

- Dashboard: total spending, transaction count and monthly/category charts.
- Add Expense: amount, category, description and date.
- Expenses: filter by category or date range, edit an expense, or confirm its deletion.
- Amounts are displayed as US dollars; multi-currency conversion is not implemented.

## Your data

Records are stored in this browser’s `localStorage` under `finance-app-expenses`. There is no server account, bank connection, cloud sync or shared-account authorization in this version. Another browser or device does not automatically see these records. Clearing site data may permanently remove them.

Use non-sensitive sample records during development. Do not rely on this prototype as the only copy of important financial records. Close access to shared browser profiles when finished.

## Repository layout

`src/components` contains forms, lists and charts; `src/pages` defines screens; `src/services/expenseService.ts` owns browser persistence and aggregation; `src/types/expense.ts` defines the records.
