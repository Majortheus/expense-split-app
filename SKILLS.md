# SKILLS

## Design-to-code audit
- Compare the `.pen` structure against the current JSX before editing.
- Extract exact copy differences first: headings, placeholders, CTA labels, helper text.
- Then validate spacing, widths, token usage, and shared-component reuse.

## Responsive React Native execution
- Assume every screen must work on native mobile and web.
- Favor container widths, full-width content columns, and shared layout primitives over one-off absolute values.
- Keep keyboard behavior compatible with mobile while preserving web readability.

## Shared component discipline
- Improve shared components when the correction is globally correct, not only locally convenient.
- Avoid introducing screen-specific style exceptions when the design system already has a reusable pattern.

## Preferred stack patterns
- `NativeWind` for layout and theme classes.
- `react-hook-form` + `zodResolver` + `z.infer` for forms, with screen-local schemas when the form is specific to one screen.
- Expo-native primitives first for spinners/loading indicators before adding new libraries.
