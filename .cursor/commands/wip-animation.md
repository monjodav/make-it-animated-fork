# WIP Animation

## Overview
This command sets the WIP_SCREEN_HREF constant in `src/shared/lib/constants/dev.ts` by finding the href for a given animation slug in the STATIC_ANIMATIONS array.

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

### Step 3: Find Animation in STATIC_ANIMATIONS
- Read `src/shared/lib/constants/animations.ts`
- Search the `STATIC_ANIMATIONS` array for an entry where `slug` matches the provided search key (case-sensitive exact match)
- If no match is found, inform the user: "No animation found with slug: [search-key]"
- If multiple matches are found (shouldn't happen), use the first match

### Step 4: Extract href
- Extract the `href` property from the matched animation object
- The href will be in the format: `"/app-name/route"` (e.g., `"/gmail/inbox"`, `"/alma/nutrients"`)

### Step 5: Update WIP_SCREEN_HREF Constant
- Read `src/shared/lib/constants/dev.ts`
- Update the `WIP_SCREEN_HREF` constant value to the extracted href
- The constant should be updated from `""` to the href value (e.g., `export const WIP_SCREEN_HREF = "/gmail/inbox";`)
- Preserve all other code, comments, and formatting in the file

### Step 6: Confirm Update
- Display a confirmation message: "Updated WIP_SCREEN_HREF to: [href]"
- Reload the dev server (Type `r` in the terminal) if it is running to apply the changes.
