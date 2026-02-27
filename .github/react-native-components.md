# React Native Components Guide

This file documents component conventions, design tokens, and examples for UI components derived from Figma designs. Record component-level changes, API decisions, variants, and usage examples here.

Location of truth
- Implement components under `src/components/`.
- Update this file (`.github/react-native-components.md`) when you add new shared components or change component APIs, variants, or theme usage.

Stack and tooling
- React 19 (no forwardRef)
- React Native 0.72+
- Expo SDK 52+
- TypeScript strict
- Tailwind CSS v5 + Nativewind
- `clsx` for conditional classes
- `tailwind-merge` to merge Tailwind classes

Naming and structure
- Files: lowercase with hyphens e.g. `user-card.tsx`.
- Always use named exports.
- One component per file in `src/components/<component-name>/index.tsx`.
- Do not create barrel files for internal folders.

Component patterns
- Use `clsx()` to build conditional classes and `twMerge()` to combine classes.
- Use the project's theme tokens (CSS variables and named theme classes defined in `src/styles/global.css`). Do NOT hardcode color hex values in components.
- For text, always use the shared `Typography` component (`src/components/typography.tsx`). Components must accept text via `children` and delegate typographic styling to `Typography`.
- Buttons must offer variants and sizes and accept icon references as props (component or icon name). The Button implementation should not require callers to style the icon — the Button controls icon color/size via its own classes and only accepts which icon to render.

Accessibility
- Icon-only buttons must receive `accessibilityLabel`.
- Use `accessibilityRole="button"` on interactive controls.
- Keep focus-visible ring classes on interactive controls: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.

Design tokens / theme usage
- Use the project's theme tokens (CSS variables and named theme classes defined in `src/styles/global.css`). Do NOT hardcode color hex values in components.

Button guidelines (summary)
- Export `Button` as a named export from `src/components/button/index.tsx`.
- Props: extend `ComponentProps<typeof TouchableOpacity>`, plus `variant?: 'primary'|'secondary'|'danger'`, `size?: 'sm'|'md'|'lg'`, `startIcon?: ComponentType<{ className?: string }>` and `endIcon?: ComponentType<{ className?: string }>`, `iconOnly?: boolean`.
- Use `Typography` for label text.
- Use theme classes (above) for backgrounds, borders and text colors.
- Provide `iconOnly` mode; ensure `accessibilityLabel` is recommended.

Examples
- Show concrete examples and usage snippets here for future reference (stories or code samples). Update this file when adding new variants.

Checklist for component changes
- [ ] Add component under `src/components/` with named export.
- [ ] Update this `.github/react-native-components.md` with the rationale and examples.
- [ ] Run `npm run format` and `npm run lint` and address style/lint issues.

