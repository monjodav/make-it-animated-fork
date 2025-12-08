import { FlatList, Pressable, StyleSheet, useWindowDimensions } from "react-native";
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

  const isActive = userIndex === listCurrentIndex;

  const videoPlayerRef = useRef<VideoRef>(null);

  const storyProgress = useSharedValue(0);

  const pause = useCallback(() => {
    videoPlayerRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    videoPlayerRef.current?.resume();
  }, []);

  useEffect(() => {
    if (isActive) {
      storyProgress.set(0);
      videoPlayerRef.current?.seek(0);
      videoPlayerRef.current?.resume();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStoryIndex, userIndex, listCurrentIndex]);

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
        onPress={(e) => {
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
        }}
        onLongPress={() => {
          videoPlayerRef.current?.pause();
        }}
        delayLongPress={250}
        onPressOut={() => {
          if (isDragging.get()) return;
          videoPlayerRef.current?.resume();
        }}
      >
        <Video
          ref={videoPlayerRef}
          source={{ uri: FakeVideo }}
          paused
          muted
          style={{ width: "100%", height: "100%", opacity: 0 }}
          controls={false}
          progressUpdateInterval={16}
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
