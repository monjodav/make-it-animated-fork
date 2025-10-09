import { Stack } from "expo-router";
import { SharedTabsHeader } from "@/src/apps/(s-t)/shopify/components/shared-tabs-header";
import { MenuProvider } from "@/src/apps/(s-t)/shopify/lib/providers/menu-provider";
import { View } from "react-native";
import { Menu } from "@/src/apps/(s-t)/shopify/components/menu";
import { AnimatedTabsContainer } from "@/src/apps/(s-t)/shopify/components/animated-tabs-container";

// shopify-menu-transition-animation 🔽

export default function ShopifyLayout() {
  return (
    <MenuProvider>
      <View className="flex-1 bg-black">
        {/* 
          AnimatedTabsContainer
          Why: centralizes cross-screen shared values (scroll offsets, menuProgress)
          so header/tab/menu animations can run on the UI thread without prop-drilling. 
        */}
        <AnimatedTabsContainer>
          <Stack
            screenOptions={{
              // shopify-tabs-shared-header-animation 🔽
              header: () => <SharedTabsHeader />,
              // shopify-tabs-shared-header-animation 🔼
              contentStyle: {
                backgroundColor: "white",
              },
            }}
          />
        </AnimatedTabsContainer>
        {/* 
          Menu overlay and close button live at the layout level.
          Why: render above all tabs to animate in-place across screens, avoid remounts,
          and prevent circular dependencies while still accessing shared values.
          Overlay sits outside <Tabs> so the spring-in animation can cover any tab content.
        */}
        <Menu />
      </View>
    </MenuProvider>
  );
}

// shopify-menu-transition-animation 🔼
