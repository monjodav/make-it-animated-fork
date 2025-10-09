import { Stack } from "expo-router";

const OpalLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="details"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
};

export default OpalLayout;
