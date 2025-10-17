<p align="center">
  <img src="./assets/images/misc/github-banner.png" alt="Make it Animated Logo" width="100%"/>
</p>

## Thank you for purchasing access to Make it Animated!

I'm thrilled to have you on board. Your support means a lot to me, and I'm confident that this library will help you create stunning and engaging applications. I'm excited to see what you'll build! Stay tuned for future updates.

> **Note:** All animation previews are available on our website: [www.makeitanimated.dev](https://www.makeitanimated.dev)

## Quick Start

Getting started with Make it Animated is easy. Follow these steps to run the project locally:

```bash
# Install dependencies
npm install

# Build on iOS device
npm run ios

# Build on Android device
npm run android

# Start the development server
npm run dev
```

## System Requirements

- **Expo SDK 54** - For more details, check the [Expo 54 Changelog Blog Post ](https://expo.dev/changelog/sdk-54)

### iOS Development

- Xcode 16.0+
- iOS 15.1+

### Android Development

- Android 7.0+ (API level 24+)
- compileSdkVersion 35

## Project Structure

The project is organized as follows:

```
make-it-animated/
├── app/                  # Expo Router navigation structure
│   ├── (apps)/           # Group containing individual animation routes
│   │   ├── (a-c)/        # Alphabetically grouped app routes
│   │   ├── (d-f)/        # Alphabetically grouped app routes
│   │   └── ...           # More route groups
│   ├── _layout.tsx       # Main layout for the app
│   └── index.tsx         # Entry point/home screen
├── assets/               # Images, fonts, and other static resources
├── src/                  # Source code for animations
│   ├── apps/             # Individual animation implementations
│   │   ├── (a-c)/        # Alphabetically grouped apps
│   │   ├── (d-f)/        # Alphabetically grouped apps
│   │   └── ...           # More apps groups
│   └── shared/           # Shared components and utilities
│       ├── components/   # Reusable UI components
│       └── lib/          # Utility functions and hooks
```

### Key Directories Explained

- **app/**: Contains all the Expo Router navigation setup. Each folder corresponds to a route group.
- **src/apps/**: Contains the actual implementation code for each app animation, grouped alphabetically.
- **src/shared/**: Contains reusable components, hooks, and utilities used across the app.

### App Animation Structure

Each app (e.g src/apps/(g-i)/gmail) typically follows this structure:

```
app-name/
├── components/           # Components specific to this app (optional)
├── lib/                  # Hooks, utils, providers, constants for this app (optional)
└── routes/               # Route files for the app which will be used by Expo Router
```

## Need Help?

Visit [www.makeitanimated.dev](https://www.makeitanimated.dev) and choose the contact method that works best for you.

---

Thank you again for your support! Happy animating! 🚀
