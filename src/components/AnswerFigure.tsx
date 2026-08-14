import Image from "next/image";
import type { AnswerImage } from "@/lib/types";

type Props = {
  image: AnswerImage;
  priority?: boolean;
};

export function AnswerFigure({ image, priority = false }: Props) {
  return (
    <figure className="answer-figure">
      <Image
        src={image.src}
        alt={image.alt}
        width={1024}
        height={1024}
        className="answer-figure-img"
        priority={priority}
        sizes="(max-width: 768px) 100vw, 720px"
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
