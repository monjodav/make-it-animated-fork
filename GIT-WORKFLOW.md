# Git Workflow Guide

This guide explains the recommended git workflow for working with this repository, helping you stay up-to-date with the latest changes while avoiding merge conflicts.

## Choosing Your Branch Strategy

When you clone this repository, you have two common scenarios:

### Scenario 1: No Changes to Commit (Read-Only)

If you're only exploring the codebase, running the app, or learning from the examples **without making any changes**, you can safely work on the `main` branch:

```bash
# Clone and stay on main branch
git clone https://github.com/make-it-animated/react-native.git
cd react-native

# You're already on main branch - safe to explore!
```

**When to use this:**

- Just exploring the codebase
- Running the app locally
- Learning from examples
- No modifications planned

### Scenario 2: Making Changes (Development)

If you plan to modify code, add features, or make any changes that you might want to commit, **always create your own branch**:

```bash
# Clone the repository
git clone https://github.com/make-it-animated/react-native.git
cd react-native

# Create and switch to your own branch
git checkout -b your-feature-branch

# Now you can safely make changes
```

**When to use this:**

- Modifying existing code
- Adding new features
- Experimenting with changes
- Any development work

## Why Use Your Own Branch?

Working on your own branch allows you to regularly pull updates from `main` without conflicts. Your changes are isolated, making it easier to resolve conflicts when pulling updates and keep your development work separate from the main branch.

## Recommended Workflow

### For Regular Development

```bash
# 1. Start your work session
git checkout your-feature-branch

# 2. Before starting work, pull latest changes
git fetch origin
git merge origin/main

# Or merge from local main (update main first)
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main

# 3. Make your changes
# ... edit files ...

# 4. Commit your changes
git add .
git commit -m "Your commit message"

# 5. Push to your branch (if you have a remote)
git push origin your-feature-branch
```

### Keeping Your Branch Updated

Regularly sync with the main branch to avoid large merge conflicts:

```bash
# Fetch latest changes
git fetch origin

# Merge main into your branch
git merge origin/main

# Or merge from local main (update main first)
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main
```

## Quick Reference

| Situation           | Branch to Use   | Why                            |
| ------------------- | --------------- | ------------------------------ |
| Just exploring      | `main`          | No conflicts, simple workflow  |
| Making changes      | Your own branch | Isolated work, easy updates    |
| Regular development | Your own branch | Stay updated without conflicts |

## Need Help?

If you encounter merge conflicts or have questions about git workflow, refer to the [Git documentation](https://git-scm.com/doc) or reach out through our [contact page](https://www.makeitanimated.dev).
