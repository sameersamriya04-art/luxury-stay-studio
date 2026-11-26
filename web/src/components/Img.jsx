import { img } from "../data/content";

// Responsive WebP image: phones download the 960px file, large screens the 1920px one.
export default function Img({ name, alt = "", sizes = "100vw", className = "", eager = false, ...rest }) {
  const { src, srcSet } = img(name);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}
