import {
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedReaction,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { User } from "../../../lib/data/users";
import { scheduleOnRN } from "react-native-worklets";
import { Footer } from "./footer";
import { Header } from "./header";
import { Container } from "./container";
import FakeVideo from "@/assets/videos/fake-video.mp4";
import Video, { VideoRef } from "react-native-video";
import { LinearGradient } from "expo-linear-gradient";
import { easeGradient } from "@/src/shared/lib/utils/ease-gradient";

// instagram-stories-carousel-animation 🔽

type UserItemProps = {
  user: User;
  userIndex: number;
  totalUsers: number;
  listAnimatedIndex: SharedValue<number>;
  listCurrentIndex: number;
  isDragging: SharedValue<boolean>;
  scrollRef: React.RefObject<FlatList<User> | null>;
};

const UserStoriesItem: FC<UserItemProps> = ({
  user,
  userIndex,
  totalUsers,
  listAnimatedIndex,
  listCurrentIndex,
  isDragging,
  scrollRef,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const { width: screenWidth } = useWindowDimensions();

  // Only active card should play video and update progress
  const isActive = userIndex === listCurrentIndex;

  const videoPlayerRef = useRef<VideoRef>(null);

  // Shared value tracks video playback progress (0-1) for progress bar animation
  // Updated on UI thread via onProgress callback, read by progress bar component
  const storyProgress = useSharedValue(0);

  const pause = useCallback(() => {
    videoPlayerRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    videoPlayerRef.current?.resume();
  }, []);

  // Reset story progress and video position when:
  // - User switches to this card (becomes active)
  // - User navigates to different story within this card
  useEffect(() => {
    if (isActive) {
      storyProgress.set(0);
      videoPlayerRef.current?.seek(0);
      videoPlayerRef.current?.resume();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStoryIndex, userIndex, listCurrentIndex]);

  // Pause video playback during scroll drag to prevent stuttering
  // Resumes only if this card is still active after drag ends
  // scheduleOnRN bridges worklet context to React Native thread for video control
  useAnimatedReaction(
    () => isDragging.get(),
    (current) => {
      if (current) {
        scheduleOnRN(pause);
      } else {
        if (userIndex === listCurrentIndex) {
          scheduleOnRN(resume);
        }
      }
    }
  );

  const onStoryPress = useCallback(
    (e: GestureResponderEvent) => {
      const screenX = e.nativeEvent.pageX;
      const isLeft = screenX < screenWidth / 2;
      const isLastStory = currentStoryIndex === user.stories.length - 1;
      const isFirstStory = currentStoryIndex === 0;
      const isFirstUser = userIndex === 0;
      const isLastUser = userIndex === totalUsers - 1;

      if (isLeft) {
        if (isFirstUser && isFirstStory) {
          return;
        }
        if (isFirstStory && !isFirstUser) {
          scrollRef.current?.scrollToIndex({ index: userIndex - 1, animated: true });
          return;
        }
        if (!isFirstStory) {
          setCurrentStoryIndex(currentStoryIndex - 1);
        }
      } else {
        if (isLastUser && isLastStory) {
          return;
        }
        if (isLastStory) {
          if (userIndex < totalUsers - 1) {
            scrollRef.current?.scrollToIndex({ index: userIndex + 1, animated: true });
          }
        } else {
          setCurrentStoryIndex(currentStoryIndex + 1);
        }
      }
    },
    [currentStoryIndex, userIndex, totalUsers, scrollRef, screenWidth, user.stories.length]
  );

  const onStoryLongPress = useCallback(() => {
    videoPlayerRef.current?.pause();
  }, []);

  const onStoryPressOut = useCallback(() => {
    if (isDragging.get()) return;
    videoPlayerRef.current?.resume();
  }, [isDragging]);

  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: "rgba(0,0,0,0.25)" },
      1: { color: "rgba(0,0,0,0.0)" },
    },
  });

  return (
    <Container listAnimatedIndex={listAnimatedIndex} userIndex={userIndex}>
      <Pressable
        className="flex-1"
        // Tap left half: go to previous story/user
        // Tap right half: go to next story/user
        // Handles edge cases (first/last story/user) to prevent navigation errors
        onPress={onStoryPress}
        // Long press pauses video (e.g., to read text in story)
        // 250ms delay prevents accidental pauses during quick taps
        onLongPress={onStoryLongPress}
        delayLongPress={250}
        // Resume on release, but only if not currently dragging (prevents conflicts)
        onPressOut={onStoryPressOut}
      >
        {/* Uses fake video source to simulate real app behavior and maintain animation consistency */}
        {/* Hidden (opacity: 0) but drives progress bar timing - matches Instagram's video-based story system */}
        <Video
          ref={videoPlayerRef}
          source={{ uri: FakeVideo }}
          paused
          muted
          style={{ width: "100%", height: "100%", opacity: 0 }}
          controls={false}
          // 16ms interval ≈ 60fps updates for smooth progress bar animation
          progressUpdateInterval={16}
          // Update shared value on UI thread for real-time progress bar sync
          // Only updates when this card is active to prevent unnecessary work
          onProgress={({ currentTime, playableDuration }) => {
            if (!isActive) return;
            const progress = currentTime / playableDuration;
            storyProgress.set(progress);
          }}
          onEnd={() => {
            if (!isActive) return;
            if (currentStoryIndex < user.stories.length - 1) {
              setCurrentStoryIndex(currentStoryIndex + 1);
            } else {
              if (userIndex < totalUsers - 1) {
                scrollRef.current?.scrollToIndex({ index: userIndex + 1, animated: true });
              }
            }
          }}
        />
        {/* Decorative image overlay only - provides visual content while video drives timing */}
        {/* Fade transition between stories: 200ms provides smooth visual continuity */}
        {/* Key on blurhash forces remount when story changes, triggering enter/exit animations */}
        <Animated.View
          key={user.stories[currentStoryIndex]?.blurhash}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={StyleSheet.absoluteFill}
        >
          <Image
            contentFit="cover"
            placeholder={{
              blurhash: user.stories[currentStoryIndex]?.blurhash,
            }}
            style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
          />
        </Animated.View>
        <LinearGradient
          colors={colors}
          locations={locations}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200 }}
        />
      </Pressable>
      <Header user={user} currentStoryIndex={currentStoryIndex} storyProgress={storyProgress} />
      <Footer />
    </Container>
  );
};

export default UserStoriesItem;

// instagram-stories-carousel-animation 🔼
