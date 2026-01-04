# Code Conventions

## General Principles

- **Self-documenting code**: Write clear, descriptive variable and function names. Avoid comments that explain *what* the code does; the code should speak for itself. Comments are acceptable for *why* something is done if it's non-obvious.
- **Keep it simple**: Only add complexity when necessary. No premature abstractions.
- **Consistency**: Follow existing patterns in the codebase.

## TypeScript

- Use types and interfaces for data structures
- Enums for fixed sets of values
- Centralize shared types in `app/types/index.ts`
- Centralize configuration in `app/config/site.ts`

## React / Next.js

- Use `useSyncExternalStore` for hydration-safe client state (mounted, locale detection)
- Prefer CSS breakpoints over JavaScript-based responsive logic
- Use Tailwind utility classes; avoid inline styles
- Static data lives in `app/data/`

## Styling

- Two fonts only: DM Sans (sans-serif) and Newsreader (serif)
- Headings use serif; body text uses sans-serif
- Support dark and light themes via `dark:` and `light:` variants
- Three breakpoints: mobile (default), tablet (`sm:`), desktop (`md:`/`lg:`)

## File Organization

```
app/
├── components/    # Reusable UI components
├── config/        # Site configuration
├── data/          # Static data files
├── types/         # Shared TypeScript types
└── [page]/        # Page routes
```

