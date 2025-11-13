# Enterprise SDK - Agent Guidelines

## Commands

- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm test --filter=@skygenesisenterprise/core` - Run single package tests
- `pnpm test path/to/file.test.ts` - Run specific test file
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Lint all packages
- `pnpm dev` - Development mode with watch

## Code Style

- Use TypeScript with strict mode enabled
- Import order: external libs → internal packages → relative imports
- Use `@skygenesisenterprise/*` workspace imports for cross-package dependencies
- Naming: PascalCase for classes/components, camelCase for functions/variables
- Error handling: Always catch and re-throw with context, use custom error classes
- No `any` types without justification, prefer unknown with type guards
- Use `const` by default, `let` only when reassignment needed
- Async functions should handle errors gracefully and provide meaningful messages

## Architecture

- Follow monorepo structure with packages in `packages/` directory
- Each package has its own package.json with build/test scripts
- Use Turbo for build orchestration and caching
- WASM runtime with JS fallbacks for compatibility
- Module-based architecture with clear separation of concerns

## Testing Requirements

- **MANDATORY**: Every code modification or addition must include corresponding tests
- Write unit tests for new functions, classes, and components
- Add integration tests for new features and modules
- Test error cases and edge conditions
- Use descriptive test names that explain what is being tested
- Follow the existing test patterns using Vitest
- Run `pnpm test` before committing to ensure all tests pass
- Aim for high test coverage on new code (minimum 80%)
- Test framework-specific integrations (Next.js, React, etc.) when applicable
