import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
};

/** Speech-bubble icon from AnswerKit brand artwork. */
export function BrandIcon({ size = 44, className = "" }: Props) {
  return (
    <Image
      src="/answerkit-icon.png"
      alt=""
      width={389}
      height={314}
      aria-hidden
      className={`brand-icon-img ${className}`.trim()}
      style={{ width: size, height: size }}
    />
  );
}
