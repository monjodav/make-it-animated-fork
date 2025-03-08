import { CustomHeader } from "../components/custom-header";
import { AnimatedListProvider } from "../lib/providers/animated-list-provider";
import { ContentList } from "../components/content-list";
import { View } from "react-native";

// gmail-header-scroll-animation 🔽

export default function Home() {
  return (
    <AnimatedListProvider>
      <View className="flex-1 bg-neutral-900">
        <ContentList />
        <CustomHeader />
      </View>
    </AnimatedListProvider>
  );
}

// gmail-header-scroll-animation 🔼
