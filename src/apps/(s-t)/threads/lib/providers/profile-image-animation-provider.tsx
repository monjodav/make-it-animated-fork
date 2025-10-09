import { useTargetMeasurement } from "@/src/shared/lib/hooks/use-target-measurment";
import { createContext, FC, PropsWithChildren, useContext } from "react";
import { useWindowDimensions } from "react-native";
import {
  AnimatedRef,
  Easing,
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useBottomTabsStore } from "../store/bottom-tabs";
import { useScrollViewOffset } from "@/src/shared/lib/hooks/use-scroll-view-offset";
import { scheduleOnRN } from "react-native-worklets";

// threads-profile-picture-animation 🔽

// 250ms matches system animation durations for natural feel
// Short enough for responsive UI, long enough for smooth perception
const _duration = 250;
// Easing.out(Easing.quad) creates slight deceleration for natural movement
export const _timingConfig = { duration: _duration, easing: Easing.out(Easing.quad) };

type ContextValue = {
  listOffsetX: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  defaultProfileImageSize: number;
  expandedProfileImageSize: number;
  targetRef: AnimatedRef<React.Component<{}, {}, any>>;
  onTargetLayout: () => void;
  imageState: SharedValue<"open" | "close">;
  imageXCoord: SharedValue<number>;
  imageYCoord: SharedValue<number>;
  imageSize: SharedValue<number>;
  blurIntensity: SharedValue<number>;
  closeBtnOpacity: SharedValue<number>;
  open: () => void;
  close: () => void;
};

const ProfileImageAnimationContext = createContext<ContextValue>({} as ContextValue);

export const ProfileImageAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const setIsBottomTabsHidden = useBottomTabsStore.use.setIsBottomTabsHidden();

  // Screen center coordinates for positioning expanded image precisely in viewport center
  const screenCenterX = screenWidth / 2;
  const screenCenterY = screenHeight / 2;
  const defaultProfileImageSize = 70;
  // 65% of screen width balances image visibility with background context
  // Large enough to see details without overwhelming the screen
  const expandedProfileImageSize = screenWidth * 0.65;

  const { scrollOffsetY: listOffsetX, scrollHandler } = useScrollViewOffset();

  const { targetRef, onTargetLayout, measurement } = useTargetMeasurement();

  // Shared values coordinate animation state across components without re-renders
  // Initial "close" state ensures animation only starts after user interaction
  const imageState = useSharedValue<"open" | "close">("close");
  // Default to screen center as fallback position until measurement completes
  const imageXCoord = useSharedValue(screenCenterX);
  const imageYCoord = useSharedValue(screenCenterY);
  // Start with default size to match the profile image component
  const imageSize = useSharedValue(defaultProfileImageSize);
  // Blur starts at 0 (no blur) when image is in default state
  const blurIntensity = useSharedValue(0);
  // Close button hidden initially, appears after animation completes
  const closeBtnOpacity = useSharedValue(0);

  // Track profile image position as user scrolls to ensure animation starts from current position
  // This creates the illusion that the same image is animating, not two separate components
  useAnimatedReaction(
    () => {
      return {
        measurement: measurement.value,
        listOffsetX: listOffsetX.value,
      };
    },
    ({ measurement, listOffsetX }) => {
      if (measurement === null) return;

      // Update coordinates accounting for scroll position to maintain visual connection
      imageXCoord.value = measurement.pageX;
      // Subtract scroll offset to maintain correct vertical position during scrolling
      imageYCoord.value = measurement.pageY - listOffsetX;
    }
  );

  const open = () => {
    "worklet";

    // Hide bottom tabs to create immersive view experience
    scheduleOnRN(setIsBottomTabsHidden, true);
    // Immediate state change ensures proper rendering order
    imageState.value = "open";
    // Blur intensity 100 matches iOS system blur intensity
    blurIntensity.value = withTiming(100, _timingConfig);
    // Animate size, x, and y coordinates simultaneously for cohesive motion
    imageSize.value = withTiming(expandedProfileImageSize, _timingConfig);
    // Center horizontally by offsetting by half the expanded size
    imageXCoord.value = withTiming(screenCenterX - expandedProfileImageSize / 2, _timingConfig);
    // Center vertically using same calculation for visual balance
    imageYCoord.value = withTiming(screenCenterY - expandedProfileImageSize / 2, _timingConfig);
    // Delay close button appearance until main animation completes for sequential focus
    closeBtnOpacity.value = withDelay(_duration, withTiming(1));
  };

  const close = () => {
    "worklet";

    // Restore bottom tabs after animation completes
    scheduleOnRN(setIsBottomTabsHidden, false);

    // Get the current position of the original profile image accounting for possible layout changes
    const x = measurement.value?.pageX ?? 0;
    const y = measurement.value?.pageY ?? 0;

    // Delay state change until animation completes to prevent flickering
    // Duration 0 ensures immediate state change after delay for proper cleanup
    imageState.value = withDelay(_duration, withTiming("close", { duration: 0 }));
    // Animate blur away first for visual hierarchy - background before foreground
    blurIntensity.value = withTiming(0, _timingConfig);
    // Return to original size simultaneously with position for cohesive motion
    imageSize.value = withTiming(defaultProfileImageSize, _timingConfig);
    // Return to original horizontal position
    imageXCoord.value = withTiming(x, _timingConfig);
    // Account for current scroll position to ensure perfect alignment with original image
    imageYCoord.value = withTiming(y - listOffsetX.value, _timingConfig);
    // Hide close button immediately as animation begins
    closeBtnOpacity.value = withTiming(0, { duration: _duration });
  };

  return (
    <ProfileImageAnimationContext.Provider
      value={{
        listOffsetX,
        scrollHandler,
        defaultProfileImageSize,
        expandedProfileImageSize,
        targetRef,
        onTargetLayout,
        imageState,
        imageXCoord,
        imageYCoord,
        imageSize,
        blurIntensity,
        closeBtnOpacity,
        open,
        close,
      }}
    >
      {children}
    </ProfileImageAnimationContext.Provider>
  );
};

export const useProfileImageAnimation = () => {
  const context = useContext(ProfileImageAnimationContext);

  if (!context) {
    throw new Error(
      "useProfileImageAnimation must be used within an ProfileImageAnimationProvider"
    );
  }

  return context;
};

// threads-profile-picture-animation 🔼
