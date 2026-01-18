# Detect Animation Files

## Overview
This command finds all files in the codebase that contain a specific animation search key (slug).

## Requirements
- **Search key (slug)**: Required parameter provided by the user

## Workflow

### Step 1: Validate Input
- If no search key is provided, ask the user to provide one
- Provide examples: `"alma-nutrients-circular-carousel-animation"` or `"gmail-header-scroll-animation"`

### Step 2: Locate Search Key (if user needs help)
The search key can be found in one of these ways:
1. **makeitanimated.dev website**: Press the "Copy search key" button on the animation website page (https://makeitanimated.dev/animations/[slug]) - *Note: You must be logged in to access this feature*
2. **URL slug**: Extract the slug from the animation URL
3. **Constants file**: Look up the slug in `src/shared/lib/constants/animations.ts`

### Step 3: Search Files
- Search the entire codebase for files containing the provided search key
- Use case-sensitive exact match for the search key
- Include all file types (`.tsx`, `.ts`, `.js`, `.jsx`, `.md`, etc.)

### Step 4: Output Results
- Display the results as a list titled **"Detected files"**
- Include the full file paths relative to the workspace root
- If no files are found, clearly state: "No files found containing the search key: [search-key]"