import { View } from "react-native";
import { CustomHeader } from "../components/custom-header";
import { useHomeHeaderHeight } from "../lib/hooks/use-home-header-height";
import { AnimatedScrollProvider } from "../lib/providers/animated-scroll";
import { Post } from "../lib/types";
import { HomeList } from "../components/home-list";

const posts: Post[] = [
  {
    images: Array.from({ length: 8 }).map((_, index) => index),
    description: `Lorem ipsum dolor sit,
consectetur adipiscing elit

Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.

Lorem ipsum dolor sit amet,
consectetur adipiscing elit.

Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.`,
  },
  {
    images: Array.from({ length: 11 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
  {
    images: Array.from({ length: 4 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet.",
  },
  {
    images: Array.from({ length: 12 }).map((_, index) => index),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    images: Array.from({ length: 2 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
  {
    images: Array.from({ length: 10 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
  {
    images: Array.from({ length: 6 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
  {
    images: Array.from({ length: 16 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
  {
    images: Array.from({ length: 12 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
  {
    images: Array.from({ length: 4 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
  {
    images: Array.from({ length: 12 }).map((_, index) => index),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam aliquet, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.",
  },
];

export default function Home() {
  const { topSafeAreaHeight } = useHomeHeaderHeight();

  return (
    <AnimatedScrollProvider>
      <View className="flex-1 bg-black">
        <View style={{ height: topSafeAreaHeight }} />
        <View className="flex-1">
          {/* instagram-header-on-scroll-animation 🔽 */}
          <CustomHeader />
          {/* instagram-header-on-scroll-animation 🔼 */}
          <HomeList posts={posts} />
        </View>
      </View>
    </AnimatedScrollProvider>
  );
}
