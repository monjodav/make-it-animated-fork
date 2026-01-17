# New Animation Pattern Reference Template

## Description
Template for creating a new animation pattern reference file in `.cursor/skills/animation-patterns/references/`.

## Usage
1. Replace `[pattern-name]` with your pattern name (e.g., `animation-context`)
2. Replace `[Pattern Name]` with human-readable name (e.g., `Animation Context Pattern`)
3. Fill in the sections with your pattern-specific content
4. Save as `.cursor/skills/animation-patterns/references/[pattern-name].md`

## Template

```markdown
# [Pattern Name]

## Overview

[Brief description of the pattern and what it does]

## High-Level Architecture

```
[ASCII diagram or description of the architecture]
```

## Key Components

### 1. [Component Name]

[Description of the first key component]

**What it provides:**
- [Feature 1]
- [Feature 2]

### 2. [Component Name]

[Description of the second key component]

### 3. [Component Name]

[Description of the third key component]

### 4. [Component Name]

[Description of the fourth key component]

## Pattern Flow

### Initialization
1. [Step 1]
2. [Step 2]
3. [Step 3]

### [Process Name]
1. [Step 1]
2. [Step 2]
3. [Step 3]

### [Process Name]
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Key Concepts

### [Concept Name]

[Explanation of the concept]

### [Concept Name]

[Explanation of the concept]

### [Concept Name]

[Explanation of the concept]

## Example References

The following examples demonstrate this pattern in the codebase. **These are reference implementations only and must not be used directly as source of truth.** Always follow the guidelines from:
- `.cursor/skills/animation-performance` - for performance optimizations
- `.cursor/skills/animation-with-react-compiler` - for React Compiler compatibility
- `.cursor/skills/animation-with-worklets` - for worklet scheduling patterns

### [Example Name]

**Slug:** `[slug-name]`

**Reference files:**
- `[file-path-1]`
- `[file-path-2]`
- `[file-path-3]`
```
