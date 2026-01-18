# Make Performance Review

## Overview
This command performs a comprehensive code review focused on animation performance optimization based on the guidelines in `.cursor/skills/animation-performance/references/`. It analyzes code for performance issues, anti-patterns, and optimization opportunities.

## Requirements
- **Files to review**: Required parameter provided by the user
  - Can be: current file, list of files, or all files in a folder
  - If not provided, ask the user to specify

## Workflow

### Step 1: Validate Input
- If no files are provided, ask the user to specify:
  - Current file (use the file currently open/focused)
  - List of files (comma-separated or array)
  - Folder path (review all files in the folder)
- Clarify the scope: single file, multiple files, or entire folder

### Step 2: Read Animation Performance References
- Read `.cursor/skills/animation-performance/SKILL.md` to understand the review criteria and priority structure
- Use the **Priority-Ordered Guidelines** table (lines 22-35) to organize checks by priority (Critical → High → Medium)
- Use the **References** section (lines 73-143) to identify all guideline files to check
- Read all reference files from `.cursor/skills/animation-performance/references/` as needed for detailed review criteria

### Step 3: Analyze Files
For each file to review:

1. **Read the file content**
2. **Check for animation-related code**:
   - Import statements from `react-native-reanimated`
   - Use of `useSharedValue`, `useAnimatedStyle`, `useDerivedValue`, etc.
   - Animation hooks and worklets
   - Gesture handlers
   - Animated components

3. **Perform comprehensive review and fix issues** against all performance guidelines:

   Review all guidelines listed in `.cursor/skills/animation-performance/SKILL.md`, organized by priority:
   
   - **Critical Priority** (Priority 1-2): Shared Values Usage, Re-renders
   - **High Priority** (Priority 3-7): Memoization, Animation Calculations, Layout vs Transform, Reactions, Hooks Selection
   - **Medium Priority** (Priority 8-10): Animation Lifecycle, Component Limits, Scroll Optimization
   
   For each guideline category, check all corresponding reference files listed in the SKILL.md References section.

4. **Fix issues found**:
   - For each issue identified, apply the fix directly to the code
   - Fix issues in priority order: Critical → High → Medium
   - Use the examples and patterns from the reference files as guidance
   - Ensure fixes follow the project's coding standards and component structure rules
   - Make all necessary changes to resolve performance issues

## Review Criteria Reference

All checks are based on `.cursor/skills/animation-performance/SKILL.md`:

- **Priority structure**: See "Priority-Ordered Guidelines" table (lines 22-35)
- **All guideline files**: See "References" section (lines 73-143) for complete list of reference files organized by category
- **Detailed criteria**: Each reference file in `.cursor/skills/animation-performance/references/` contains specific checks and examples

## Important Notes

- **Be thorough**: Check ALL guidelines, not just obvious ones
- **Fix in priority order**: Address Critical issues first, then High, then Medium
- **Apply fixes directly**: Make the code changes, don't just suggest them
- **Reference guidelines**: Use the reference files to ensure fixes follow best practices
- **Follow project standards**: Ensure fixes comply with component structure rules and coding standards
- **Check for false positives**: Only fix actual issues, not valid patterns
- **Preserve functionality**: Ensure fixes don't break existing functionality
- **Test changes**: Verify that fixes improve performance without introducing bugs
