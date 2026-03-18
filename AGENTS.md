# AGENTS

## Objective
- Build React Native screens that stay faithful to the design source while still behaving well on mobile and web.

## UI implementation rules
- Prefer existing shared components in `src/components` before adding local JSX/styling.
- Use `NativeWind` classes and project tokens from `src/styles/global.css`; avoid ad hoc colors when a project token already exists.
- Treat `.pen` files as the visual source of truth for copy, spacing, component order, and hierarchy.
- Keep layouts responsive for both native devices and web. Avoid desktop-only assumptions and verify full-width content blocks still behave correctly on narrow screens.
- When a design already matches the current implementation, preserve it; only change the parts that are actually divergent.

## Auth screen rules
- `signin` and `signup` should mirror the `.pen` literally for visible content unless product behavior explicitly requires otherwise.
- Use full-width action buttons inside the content column so the same layout works on mobile and web.
- Keep the dark shell, panel spacing, and tokenized typography aligned with the design system.

## Forms
- Keep screen-specific `zod` schemas in the same file, above the component, when that improves maintenance.
- Use `zod` schemas plus `react-hook-form` via `zodResolver`.
- Infer form types from the schema with `z.infer` instead of duplicating types manually.
- Keep validation messages in the UI layer concise and in Portuguese when the screen copy is in Portuguese.

## Navigation
- With Expo Router in this project, prefer direct route strings inline in the component code instead of page-level route constants.

## Loading states
- Shared interactive components should own their loading presentation.
- Buttons must support a loading state that disables interaction automatically and renders a spinner compatible with React Native + Expo while preserving the button label.
