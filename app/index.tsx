import { Animations } from "@/components/_home/animations";
import { StatusBar } from "expo-status-bar";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/viber/chats" />;

  // return (
  //   <>
  //     <StatusBar style="light" />
  //     <Animations />
  //   </>
  // );
}
