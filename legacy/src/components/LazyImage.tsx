import { useState } from "react";

export default function LazyImage({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      className={`lazy-image ${loaded ? "lazy-image--loaded" : "lazy-image--loading"}`}
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      onClick={onClick}
    />
  );
}
