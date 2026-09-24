# Sample Sale Planner

This folder contains the React front end for the Sample Sale Planner. It lets a user describe a sample sale and create a list of items they want to find.

## How the front end was built

### 1. Choose a small React foundation

The app uses React with Vite. Vite was selected because it provides a fast development server and a small production build with very little configuration. React is useful here because the page needs interactive form state and a changing list of preferences.

The project uses Vite 4 and React 18 because the available development machine uses Node 16. Newer Vite releases require a newer Node version, so these versions keep the project compatible with the current environment.

The important setup files are:

- `index.html` provides the browser entry point and the `root` element.
- `src/main.jsx` starts React and renders the `App` component.
- `src/App.jsx` contains the page content, state, and user actions.
- `src/styles.css` contains the visual design and responsive layout.
- `vite.config.js` enables Vite's React JSX transform.

### 2. Model the form data

The form has two levels of data:

```js
{
  saleName: '',
  saleDate: '',
  location: '',
  items: [
    {
      itemType: '',
      colour: '',
      description: '',
      priority: 'Must have'
    }
  ]
}
```

The sale details are fixed fields, while `items` is an array because users can add any number of preferences. This structure also matches the future database design: one sale plan can have many preference records.

### 3. Use controlled React inputs

`App.jsx` uses `useState` to keep the form data in React. Each input receives its current value from `plan` and updates that value through `onChange`:

```jsx
<input
  value={plan.saleName}
  onChange={(event) => updatePlan('saleName', event.target.value)}
/>
```

This makes the displayed form and the JavaScript data stay synchronized. The `updatePlan` function updates sale-level fields, while `updateItem` updates one field inside one item in the `items` array.

### 4. Connect actions to buttons

React event props connect the functions to the interface:

```jsx
<button type="button" onClick={addItem}>
  + Add another item
</button>

<form onSubmit={savePlan}>
  <button type="submit">Save my plan</button>
</form>
```

`addItem` adds a blank preference, `removeItem` removes a preference, and `savePlan` stores the current plan. The preference rows are rendered with `plan.items.map(...)`, so React redraws the list whenever the array changes.

### 5. Start with local persistence

The save action currently uses browser `localStorage`. This was chosen so the complete form workflow can be tried without database credentials or a backend server. It is suitable for a prototype, but it is not shared between users or devices.

The UI uses a restrained pink palette, expressive heading typography, and a responsive grid. The layout keeps sale details separate from item preferences so the main workflow is easy to scan on both desktop and mobile. The visual rules live in `src/styles.css`, while `App.jsx` stays responsible for content and behaviour.

## Run the React app

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173` or `http://127.0.0.1:5173`.

Run commands from this directory:

```bash
cd sample-sale-webapp
```

If the terminal is currently in the parent `Projects` directory, use the full path instead:

```bash
cd /Users/tafadzwamachengo/Documents/AdultLife/WarwickUni/Projects/SampleSalePlanner/sample-sale-webapp
```

Keep the `npm run dev` terminal running while using the app. To stop it, press `Ctrl+C`.

## Build and test React changes

### Production build check

After changing JSX, CSS, or the Vite configuration, run:

```bash
npm run build
```

This checks that Vite can transform the React files and produce a production bundle in `dist/`. A successful build confirms compilation, but it does not test clicks or form behaviour.

### Manual browser test

Start the development server:

```bash
npm run dev
```

Then check the following workflow in the browser:

1. Confirm the headings, form labels, and save button are visible.
2. Type a brand name and confirm the input value remains visible.
3. Add a sale date and location.
4. Enter an item type, colour, priority, and notes.
5. Select `+ Add another item` and confirm a second row appears.
6. Fill the second row and remove it with the `x` button.
7. Select `Save my plan` and confirm the message changes to `Plan saved on this device.`
8. Refresh the page and confirm the app still loads. The current UI saves plans, but it does not yet reload the saved plan into the form.
9. Resize the browser to a narrow mobile width and check that fields and the save button remain usable.

There is currently no automated test runner configured. For this small prototype, `npm run build` is the automated compilation check and the browser workflow above is the behaviour check. A future change can add Vitest and React Testing Library for automated tests of `addItem`, `removeItem`, and `savePlan`.

### Preview the production build

To test the generated production files locally:

```bash
npm run build
npm run preview
```

Open the preview URL printed by Vite. This is useful for catching differences between the development server and the final bundle.

## Current persistence and recommended database

The current form saves plans to browser `localStorage` so the UI can be tried without backend setup. A saved plan contains the sale details and a dynamic list of item preferences.

Use **PostgreSQL**, ideally through **Supabase** while this project is small. The data is relational rather than document-shaped: one sale plan has many preferences, and each preference may later have recommendation scores. PostgreSQL gives you validation, relationships, filtering, and room for analytics. Supabase adds hosted Postgres, authentication, and an API without requiring a separate server on day one.

Suggested tables:

```sql
create table sale_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  sale_name text not null,
  sale_date date,
  location text,
  created_at timestamptz not null default now()
);

create table preferences (
  id bigint generated always as identity primary key,
  plan_id uuid not null references sale_plans(id) on delete cascade,
  item_type text not null,
  colour text,
  description text,
  priority text not null,
  probability numeric,
  created_at timestamptz not null default now()
);
```

The next backend step is to replace the `localStorage` call in `src/App.jsx` with a `POST /api/plans` request, or with Supabase's client SDK. Keep database credentials server-side or in Supabase's protected client configuration; do not put a database password in React code.