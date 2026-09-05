# Repository guidance

This package is an independent React implementation of Material 3 Expressive components for the web.

- Keep components reusable and free of application-specific imports, data, icons, and class names.
- Keep media assets and application feedback behavior outside the package.
- Use Material system color, shape, state, typography, and motion tokens. Add shared motion values in `src/theme/motion.css` instead of hard-coding one-off timing.
- Preserve accessible names, keyboard behavior, 48px touch targets where applicable, reduced-motion behavior, and controlled React input semantics.
- Add or update focused tests for every behavior change.
- Run `pnpm verify` before committing.
- Do not imply that Google sponsors, endorses, or maintains this repository.
