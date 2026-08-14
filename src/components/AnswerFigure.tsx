import Image from "next/image";
import type { AnswerImage } from "@/lib/types";

type Props = {
  image: AnswerImage;
  priority?: boolean;
  /** Where the figure sits in the article layout */
  variant?: "hero" | "inline" | "step";
};

const SIZES = {
  hero: "(max-width: 768px) 200px, 240px",
  inline: "(max-width: 768px) 100vw, 680px",
  step: "(max-width: 768px) 200px, 240px",
} as const;

export function AnswerFigure({
  image,
  priority = false,
  variant = "inline",
}: Props) {
  return (
    <figure className={`answer-figure answer-figure-${variant}`}>
      <Image
        src={image.src}
        alt={image.alt}
        width={1024}
        height={1024}
        className="answer-figure-img"
        priority={priority}
        sizes={SIZES[variant]}
      />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

export function imagesForAttach(
  images: AnswerImage[] | undefined,
  attachTo: string,
): AnswerImage[] {
  return (images ?? []).filter((img) => img.attachTo === attachTo);
}
