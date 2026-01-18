# Make Code Review

## Overview
This command performs a comprehensive code review based on all project rules and guidelines. It analyzes code for:
- Component structure and organization (`.cursor/rules/react-native-component.mdc`)
- Style preferences (`.cursor/rules/styles.mdc`)
- Animation performance optimization (`.cursor/skills/animation-performance/`)
- React Compiler compatibility (`.cursor/skills/animation-with-react-compiler/`)
- Worklet scheduling patterns (`.cursor/skills/animation-with-worklets/`)

It fixes issues directly in the code rather than generating a report.

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

### Step 2: Read All Review Criteria

#### 2.1 Component Structure Rules
- Read `.cursor/rules/react-native-component.mdc` to understand:
  - Function expression style (arrow functions)
  - Component structure (module-level and component-level organization)
  - Variable naming conventions
  - Component organization patterns (one file, one component)
  - Feature slice pattern and app animation structure

#### 2.2 Style Rules
- Read `.cursor/rules/styles.mdc` to understand:
  - Tailwind class preferences over StyleSheet
  - `borderCurve: "continuous"` for rounded corners
  - `size-*` utility class usage

#### 2.3 Animation Performance Guidelines
- Read `.cursor/skills/animation-performance/SKILL.md` to understand:
  - Priority-Ordered Guidelines table (lines 22-35)
  - References section (lines 73-143) for all guideline files
- Read all reference files from `.cursor/skills/animation-performance/references/` as needed for detailed review criteria

#### 2.4 React Compiler Guidelines
- Read `.cursor/skills/animation-with-react-compiler/SKILL.md` to understand:
  - Use `get()` and `set()` methods instead of `.value` property
  - React Compiler compatibility patterns

#### 2.5 Worklet Scheduling Guidelines
- Read `.cursor/skills/animation-with-worklets/SKILL.md` to understand:
  - Use `scheduleOnRN` and `scheduleOnUI` instead of `runOnJS` and `runOnUI`
  - Don't use `"worklet"` directive unless explicitly asked
  - Always define functions outside using `useCallback`
  - Proper argument passing patterns

### Step 3: Analyze Files

For each file to review:

1. **Read the file content**

2. **Check for component structure issues**:
   - Function declaration style (should use arrow functions)
   - Module-level structure order (imports, constants, types, component)
   - Component-level structure order (state, data-related variables, hooks, callbacks, animation logic, render)
   - Variable naming (declarative and clear names)
   - Component organization (one file, one component pattern)
   - Feature slice pattern compliance

3. **Check for style issues**:
   - Use of StyleSheet when Tailwind classes could be used
   - Missing `borderCurve: "continuous"` for rounded corners > 12px
   - Use of `width-*` and `height-*` when `size-*` could be used

4. **Check for animation performance issues**:
   - Review all guidelines from `.cursor/skills/animation-performance/SKILL.md`:
     - **Critical Priority** (Priority 1-2): Shared Values Usage, Re-renders
     - **High Priority** (Priority 3-7): Memoization, Animation Calculations, Layout vs Transform, Reactions, Hooks Selection
     - **Medium Priority** (Priority 8-10): Animation Lifecycle, Component Limits, Scroll Optimization
   - Check all corresponding reference files listed in the SKILL.md References section

5. **Check for React Compiler compatibility issues**:
   - Direct access to `.value` property on shared values
   - Should use `get()` and `set()` methods instead

6. **Check for worklet scheduling issues**:
   - Use of deprecated `runOnJS` or `runOnUI` from `react-native-reanimated`
   - Should use `scheduleOnRN` and `scheduleOnUI` from `react-native-worklets`
   - Unnecessary `"worklet"` directive usage
   - Inline arrow functions passed to `scheduleOnRN` or `scheduleOnUI`
   - Functions not defined with `useCallback`

### Step 4: Fix Issues Found

Fix issues in priority order:

1. **Critical Priority Fixes** (must fix):
   - Component structure violations that break functionality
   - Animation performance critical issues (shared values on JS thread, re-renders)
   - React Compiler compatibility issues (`.value` access)

2. **High Priority Fixes** (should fix):
   - Component structure organization and naming
   - Animation performance high priority issues
   - Worklet scheduling patterns (`runOnJS`/`runOnUI` → `scheduleOnRN`/`scheduleOnUI`)
   - Style preferences (Tailwind over StyleSheet)

3. **Medium Priority Fixes** (consider fixing):
   - Animation performance medium priority issues
   - Style optimizations (`size-*`, `borderCurve`)

For each fix:
- Apply the fix directly to the code
- Use examples and patterns from the reference files as guidance
- Ensure fixes follow all project rules and coding standards
- Preserve existing functionality
- Maintain code consistency with project patterns

## Review Criteria Reference

### Component Structure
- **File**: `.cursor/rules/react-native-component.mdc`
- Covers: function style, component structure, variable naming, component organization

### Style Preferences
- **File**: `.cursor/rules/styles.mdc`
- Covers: Tailwind preferences, borderCurve, size utilities

### Animation Performance
- **File**: `.cursor/skills/animation-performance/SKILL.md`
- **Priority structure**: See "Priority-Ordered Guidelines" table (lines 22-35)
- **All guideline files**: See "References" section (lines 73-143) for complete list
- **Detailed criteria**: Each reference file in `.cursor/skills/animation-performance/references/` contains specific checks

### React Compiler Compatibility
- **File**: `.cursor/skills/animation-with-react-compiler/SKILL.md`
- Key guideline: Use `get()` and `set()` instead of `.value` property

### Worklet Scheduling
- **File**: `.cursor/skills/animation-with-worklets/SKILL.md`
- Key guidelines:
  - Use `scheduleOnRN`/`scheduleOnUI` instead of `runOnJS`/`runOnUI`
  - Don't use `"worklet"` directive unless explicitly asked
  - Define functions outside with `useCallback`

## Important Notes

- **Be thorough**: Check ALL rules and guidelines, not just obvious ones
- **Fix in priority order**: Address Critical issues first, then High, then Medium
- **Apply fixes directly**: Make the code changes, don't just suggest them
- **Reference guidelines**: Use all reference files to ensure fixes follow best practices
- **Follow project standards**: Ensure fixes comply with all component structure rules and coding standards
- **Check for false positives**: Only fix actual issues, not valid patterns
- **Preserve functionality**: Ensure fixes don't break existing functionality
- **Maintain consistency**: Keep code consistent with project patterns and conventions
- **Comprehensive coverage**: Review against all five categories (component structure, styles, animation performance, React Compiler, worklets)
