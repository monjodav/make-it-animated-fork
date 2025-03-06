import { CustomHeader } from "@/components/G-I/gmail/custom-header";
import { AnimatedListProvider } from "@/components/G-I/gmail/lib/animated-list-provider";
import { ContentList } from "@/components/G-I/gmail/lib/content-list";
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
