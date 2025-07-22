# Sanity Check Scripts

This directory contains TypeScript-based sanity check scripts to validate the built package files.

## Scripts

### Individual Checks

- **`sanity-check-types.ts`** - Validates TypeScript definition files
  - Checks that `.d.ts` files exist
  - Tests TypeScript compilation and import resolution
  - Validates export structure

- **`sanity-check-imports.ts`** - Tests import resolution
  - Tests CJS imports from `dist/cjs/`
  - Tests ESM file structure from `dist/esm/`
  - Validates both main and experimental exports

- **`sanity-check-eslint.ts`** - Runs ESLint on built files
  - Lints all JavaScript files in `dist/`
  - Uses `.eslintrc.dist.js` configuration
  - Catches syntax and style issues

### Comprehensive Check

- **`sanity-check-all.ts`** - Runs all sanity checks
  - Executes all individual checks in sequence
  - Provides summary report
  - Exits with error code if any check fails

## Usage

```bash
# Run all sanity checks
pnpm sanity-check

# Run individual checks
pnpm sanity:types
pnpm sanity:imports  
pnpm sanity:eslint
```

## Integration

- Integrated into `turbo.json` as `sanity-check` task
- Runs after `build` task
- Included in `all-checks` workflow
- Uses `npx tsx` to execute TypeScript files directly

## What Gets Validated

✅ **ES Version Compliance** - Built files use correct ES syntax
✅ **TypeScript Definitions** - Generated `.d.ts` files are valid
✅ **Import Resolution** - CJS/ESM imports work correctly
✅ **ESLint Validation** - Code quality of built files
✅ **Experimental Path** - `rooks/experimental` imports work
✅ **Export Consistency** - All expected exports are available
