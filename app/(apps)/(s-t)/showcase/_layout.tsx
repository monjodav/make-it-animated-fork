import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function ShowcaseLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#f5f5f5",
          },
          headerLargeTitle: true,
          headerSearchBarOptions:
            Platform.OS === "ios"
              ? {
                  placeholder: "Search for movies and shows",
                }
              : undefined,
          headerStyle: {
            backgroundColor: "black",
          },
          headerTransparent: Platform.OS === "ios" ? true : false,
          headerBackground: Platform.OS === "ios" ? () => <></> : undefined,
        }}
      />
    </Stack>
  );
}
