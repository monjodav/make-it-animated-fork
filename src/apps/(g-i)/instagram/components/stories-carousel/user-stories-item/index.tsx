import { FlatList, Pressable, useWindowDimensions, View } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Story, User } from "../../../lib/data/users";
import { scheduleOnRN } from "react-native-worklets";
import { Footer } from "./footer";
import { Header } from "./header";

type UserItemProps = {
  user: User;
  userIndex: number;
  totalUsers: number;
  animatedIndex: SharedValue<number>;
  currentIndex: SharedValue<number>;
  scrollRef: React.RefObject<FlatList<User> | null>;
};

const UserStoriesItem: FC<UserItemProps> = ({
  user,
  userIndex,
  totalUsers,
  animatedIndex,
  currentIndex,
  scrollRef,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const { width: screenWidth } = useWindowDimensions();

  const storyIndexProgress = useSharedValue(0);
  const animationTimeoutRef = useRef<number[]>([]);
  const isAnimatingRef = useRef(false);
  const previousActiveIndexRef = useRef(-1);

  const isPausedRef = useRef(false);
  const pausedProgressRef = useRef(0);
  const pauseTimeRef = useRef(0);

  const animateStories = () => {
    if (isAnimatingRef.current) return;

    // Clear any previous timeouts
    animationTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    animationTimeoutRef.current = [];

    // Reset progress
    storyIndexProgress.set(0);
    isAnimatingRef.current = true;

    let totalDuration = 0;

    user.stories.forEach((story: Story, storyIndex: number) => {
      const duration = story.duration || 3000;
      const targetProgress = storyIndex + 1;

      const timeout = setTimeout(() => {
        storyIndexProgress.set(withTiming(targetProgress, { duration }));
      }, totalDuration);

      animationTimeoutRef.current.push(timeout as any);
      totalDuration += duration;
    });

    // After all stories complete, scroll to next user (only if not the last user)
    if (userIndex < totalUsers - 1) {
      const scrollToNextTimeout = setTimeout(() => {
        scrollRef.current?.scrollToIndex({
          index: userIndex + 1,
          animated: true,
        });
        isAnimatingRef.current = false;
      }, totalDuration);

      animationTimeoutRef.current.push(scrollToNextTimeout as any);
    } else {
      // If last user, just mark as done after animations complete
      const doneTimeout = setTimeout(() => {
        isAnimatingRef.current = false;
      }, totalDuration);
      animationTimeoutRef.current.push(doneTimeout as any);
    }
  };

  const resetStories = () => {
    animationTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    animationTimeoutRef.current = [];
    storyIndexProgress.set(0);
    setCurrentStoryIndex(0);
    isAnimatingRef.current = false;
    isPausedRef.current = false;
  };

  const pauseStories = () => {
    if (isPausedRef.current || !isAnimatingRef.current) return;

    isPausedRef.current = true;
    pauseTimeRef.current = Date.now();
    pausedProgressRef.current = storyIndexProgress.get();

    // Cancel the ongoing animation
    storyIndexProgress.set(pausedProgressRef.current);

    // Clear all timeouts and store remaining times
    animationTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    animationTimeoutRef.current = [];
  };

  const resumeStories = () => {
    if (!isPausedRef.current || !isAnimatingRef.current) return;

    isPausedRef.current = false;
    const currentProgress = Math.floor(pausedProgressRef.current);

    // Calculate how much of current story was completed
    const completedInCurrentStory = pausedProgressRef.current - currentProgress;

    // Resume from current story
    let totalDuration = 0;

    user.stories.forEach((story: Story, storyIndex: number) => {
      if (storyIndex < currentProgress) {
        // Story already completed, skip
        return;
      }

      const fullDuration = story.duration || 3000;
      let duration = fullDuration;

      if (storyIndex === currentProgress) {
        // Current story - use remaining duration
        duration = fullDuration * (1 - completedInCurrentStory);
      }

      const targetProgress = storyIndex + 1;

      const timeout = setTimeout(() => {
        storyIndexProgress.set(withTiming(targetProgress, { duration }));
      }, totalDuration);

      animationTimeoutRef.current.push(timeout as any);
      totalDuration += duration;
    });

    // Re-add scroll timeout if needed
    if (userIndex < totalUsers - 1) {
      const scrollToNextTimeout = setTimeout(() => {
        scrollRef.current?.scrollToIndex({
          index: userIndex + 1,
          animated: true,
        });
        isAnimatingRef.current = false;
      }, totalDuration);

      animationTimeoutRef.current.push(scrollToNextTimeout as any);
    } else {
      const doneTimeout = setTimeout(() => {
        isAnimatingRef.current = false;
      }, totalDuration);
      animationTimeoutRef.current.push(doneTimeout as any);
    }
  };

  useDerivedValue(() => {
    const currentUserIndex = Math.floor(currentIndex.get());

    // Only trigger if the active index actually changed
    if (previousActiveIndexRef.current !== currentUserIndex) {
      previousActiveIndexRef.current = currentUserIndex;

      if (currentUserIndex === userIndex) {
        // This user item is active, start animation
        scheduleOnRN(animateStories);
      } else {
        // This user item is not active, reset animation
        scheduleOnRN(resetStories);
      }
    }
  });

  // Update current story index when storyIndexProgress changes
  useDerivedValue(() => {
    const storyIdx = Math.floor(storyIndexProgress.get());
    if (storyIdx >= 0 && storyIdx < user.stories.length) {
      scheduleOnRN(setCurrentStoryIndex, storyIdx);
    }
  });

  useEffect(() => {
    return () => {
      animationTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const rItemStyle = useAnimatedStyle(() => {
    const currentIdx = Math.floor(animatedIndex.get());
    const progress = animatedIndex.get() - currentIdx;

    if (userIndex === currentIdx) {
      const rotateY = interpolate(progress, [0, 1], [0, -90], Extrapolation.CLAMP);
      const translateX = interpolate(
        progress,
        [0, 1],
        [0, -screenWidth / 10000],
        Extrapolation.CLAMP
      );
      return {
        transformOrigin: "right",
        transform: [{ perspective: 2000 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    if (userIndex === currentIdx + 1) {
      const rotateY = interpolate(progress, [0, 1], [90, 0], Extrapolation.CLAMP);
      const translateX = interpolate(
        progress,
        [0, 1],
        [screenWidth / 10000, 0],
        Extrapolation.CLAMP
      );
      return {
        transformOrigin: "left",
        transform: [{ perspective: 2000 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    return {};
  });

  return (
    <Animated.View style={[{ width: screenWidth }, rItemStyle]}>
      <Pressable className="flex-1" onPressIn={pauseStories} onPressOut={resumeStories}>
        <Image
          contentFit="cover"
          placeholder={{
            blurhash: user.stories[currentStoryIndex]?.image || user.stories[0].image,
          }}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />
      </Pressable>
      <Header user={user} storyIndexProgress={storyIndexProgress} />
      <Footer />
    </Animated.View>
  );
};

export default UserStoriesItem;
