import telegramData from "@/components/telegram/telegram-data";
import { TelegramStories } from "@/components/telegram/telegram-stories";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <TelegramStories data={telegramData} />
    </SafeAreaProvider>
  );
}
