import { FlatList, Pressable } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { SharedValue, useSharedValue, withTiming, useDerivedValue } from "react-native-reanimated";
import { Image } from "expo-image";
import { Story, User } from "../../../lib/data/users";
import { scheduleOnRN } from "react-native-worklets";
import { Footer } from "./footer";
import { Header } from "./header";
import { Container } from "./container";

type UserItemProps = {
  user: User;
  userIndex: number;
  totalUsers: number;
  listAnimatedIndex: SharedValue<number>;
  listCurrentIndex: SharedValue<number>;
  scrollRef: React.RefObject<FlatList<User> | null>;
};

const UserStoriesItem: FC<UserItemProps> = ({
  user,
  userIndex,
  totalUsers,
  listAnimatedIndex,
  listCurrentIndex,
  scrollRef,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

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
    const currentUserIndex = Math.floor(listCurrentIndex.get());

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

  return (
    <Container listAnimatedIndex={listAnimatedIndex} userIndex={userIndex}>
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
    </Container>
  );
};

export default UserStoriesItem;
