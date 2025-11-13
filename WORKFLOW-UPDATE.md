# Workflow Update Summary

## Changes Made

Updated `.github/workflows/test-release.yml` to support development-driven testing:

### Trigger Changes

- **Before**: Only triggered on tags
- **After**: Triggers on pushes to branches (main, develop, release/_, feature/_) and pull requests

### Version Extraction Logic

Updated all jobs to use consistent branch-based version extraction:

- **release/\* branches**: Extract version from branch name (e.g., `release/1.1.4` → `1.1.4`)
- **other branches**: Use "dev" as version
- **manual triggers**: Use provided version input or default to "dev"

### Jobs Updated

1. `test-release` - Multi-environment testing
2. `integration-tests` - Integration testing
3. `performance-tests` - Performance benchmarks
4. `test-summary` - Test summary generation

## Benefits

1. **Development Testing**: Test commits on feature branches before merging
2. **Release Preparation**: Test release branches before tagging
3. **Continuous Validation**: Automated testing on all development workflows
4. **Consistent Versioning**: Unified version extraction across all jobs

## Usage

- **Feature branches**: Push to `feature/*` branches to test with version "dev"
- **Release branches**: Push to `release/1.1.4` to test with version "1.1.4"
- **Manual testing**: Use workflow_dispatch to specify custom version

The workflow now serves as both a development testing gate and release validation system.
