import Image from "next/image";

type Props = {
  variant?: "header" | "footer";
  className?: string;
  priority?: boolean;
};

/** Uses the official AnswerKit horizontal lockup (icon + wordmark). */
export function BrandLogo({ variant = "header", className = "", priority = false }: Props) {
  if (variant === "header") {
    return (
      <Image
        src="/answerkit-logo-horizontal.png"
        alt="AnswerKit"
        width={657}
        height={106}
        priority={priority}
        className={`brand-logo-header ${className}`.trim()}
      />
    );
  }

  return (
    <Image
      src="/answerkit-logo-horizontal.png"
      alt="AnswerKit — Find answers. Fast."
      width={657}
      height={106}
      priority={priority}
      className={`brand-logo-full ${className}`.trim()}
    />
  );
}
