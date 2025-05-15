import { Stack } from "expo-router";

export default function CanvaLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="projects"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTintColor: "black",
        }}
      />
    </Stack>
  );
}
