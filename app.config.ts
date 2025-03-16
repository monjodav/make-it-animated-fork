import { ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

interface EnvironmentValues {
  name: string;
  bundleIdentifier: string;
  package: string;
}

function getEnvironmentValues(): EnvironmentValues {
  if (IS_DEV) {
    return {
      name: "MIA_DEV",
      bundleIdentifier: "com.make-it-animated.app.dev",
      package: "com.makeitanimated.app.dev",
    };
  }

  return {
    name: "Make It Animated",
    bundleIdentifier: "com.make-it-animated.app",
    package: "com.makeitanimated.app",
  };
}

function getGoogleServicesFile() {
  if (IS_DEV) {
    return "";
  }
  return "./google-services.json";
}

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  expo: {
    name: getEnvironmentValues().name,
    slug: "make-it-animated",
    version: "1.1.0",
    orientation: "portrait",
    scheme: "miaapp",
    userInterfaceStyle: "automatic",
    icon: "./assets/images/icon-ios.png",
    newArchEnabled: true,
    updates: {
      url: "https://u.expo.dev/cb26971b-9cd8-4f46-ba13-809821a5015e",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    ios: {
      ...config.ios,
      supportsTablet: false,
      bundleIdentifier: getEnvironmentValues().bundleIdentifier,
      icon: "./assets/images/icon-ios.png",
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSUserNotificationUsageDescription:
          "Stay updated with our latest content! Enable notifications to be the first to know when exciting new animations are available.",
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon-android.png",
        backgroundColor: "#131316",
      },
      package: getEnvironmentValues().package,
      googleServicesFile: getGoogleServicesFile(),
      permissions: ["NOTIFICATIONS"],
    },
    plugins: [
      "expo-router",
      [
        "expo-dev-launcher",
        {
          launchMode: "most-recent",
        },
      ],
      "expo-font",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 150,
          resizeMode: "contain",
          backgroundColor: "#131316",
        },
      ],
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "react-native",
          organization: "make-it-animated",
        },
      ],
      [
        "onesignal-expo-plugin",
        {
          mode: "development",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "cb26971b-9cd8-4f46-ba13-809821a5015e",
      },
    },
    owner: "volodymyr_serbulenko",
  },
});
