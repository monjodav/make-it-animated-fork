import { CustomHeader } from "../components/custom-header";
import { ContentList } from "../components/content-list";
import { View } from "react-native";
import { ComposeBtn } from "../components/compose-btn";

// gmail-header-scroll-animation 🔽
// gmail-bottom-tab-bar-and-fab-animation 🔽

export default function Inbox() {
  return (
    <View className="flex-1 bg-neutral-900">
      <ContentList />
      <CustomHeader />
      <ComposeBtn />
    </View>
  );
}

// gmail-bottom-tab-bar-and-fab-animation 🔼
// gmail-header-scroll-animation 🔼
