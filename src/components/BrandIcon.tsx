import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
};

/** Speech-bubble icon cropped from official AnswerKit artwork. */
export function BrandIcon({ size = 44, className = "" }: Props) {
  return (
    <Image
      src="/answerkit-icon.png"
      alt=""
      width={152}
      height={152}
      aria-hidden
      className={`brand-icon-img ${className}`.trim()}
      style={{ width: size, height: size }}
    />
  );
}
