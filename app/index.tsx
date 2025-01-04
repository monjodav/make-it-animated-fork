import { Animations } from "@/components/_home/animations";
import { StatusBar } from "expo-status-bar";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/luma/discover-city" />;

  // return (
  //   <>
  //     <StatusBar style="light" />
  //     <Animations />
  //   </>
  // );
}
