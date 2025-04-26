import React, { FC } from "react";
import { View } from "react-native";
import { Board } from "../lib/types";
import { Boards } from "../components/boards";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// pinterest-navigation-between-boards-animation 🔽

const boards: Board[] = [
  {
    slug: "all",
    title: "All",
    pins: Array.from({ length: 24 }),
  },
  {
    slug: "colorsapp",
    title: "ColorsApp",
    pins: Array.from({ length: 31 }),
  },
  {
    slug: "project-1",
    title: "project 1",
    pins: Array.from({ length: 26 }),
  },
  {
    slug: "cafe-design-ideas",
    title: "Cafe Design Ideas",
    pins: Array.from({ length: 14 }),
  },
  {
    slug: "furniture",
    title: "furniture",
    pins: Array.from({ length: 7 }),
  },
  {
    slug: "cafe-decoration",
    title: "Cafe decoration",
    pins: Array.from({ length: 10 }),
  },
  {
    slug: "wild-room-coffee-place",
    title: "wild room coffee place",
    pins: Array.from({ length: 20 }),
  },
  {
    slug: "food-and-drinks",
    title: "Food and drinks",
    pins: Array.from({ length: 30 }),
  },
  {
    slug: "logo",
    title: "Logo",
    pins: Array.from({ length: 17 }),
  },
];

export const Home: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <Boards boards={boards} />
    </View>
  );
};

// pinterest-navigation-between-boards-animation 🔼
