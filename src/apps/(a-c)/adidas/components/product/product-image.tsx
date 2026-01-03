import { memo } from "react";
import { Image } from "expo-image";

// adidas-product-infinite-carousel-animation 🔽

type ProductImageProps = {
  imageUrl: string;
  height: number;
  width: number;
};

const ProductImage = ({ imageUrl, height, width }: ProductImageProps) => {
  return <Image style={{ height, width }} source={{ uri: imageUrl }} contentFit="cover" />;
};

export default memo(ProductImage);

// adidas-product-infinite-carousel-animation 🔼
