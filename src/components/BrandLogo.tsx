import Image from "next/image";

type Props = {
  variant?: "header" | "footer" | "hero";
  className?: string;
  priority?: boolean;
};

/** Official AnswerKit horizontal lockup — never crop via CSS. */
export function BrandLogo({ variant = "header", className = "", priority = false }: Props) {
  if (variant === "header") {
    return (
      <Image
        src="/answerkit-logo-horizontal.png"
        alt="AnswerKit"
        width={924}
        height={205}
        priority={priority}
        className={`brand-logo-header ${className}`.trim()}
        style={{ width: "auto", height: "36px" }}
      />
    );
  }

  if (variant === "hero") {
    return (
      <Image
        src="/answerkit-logo-horizontal.png"
        alt="AnswerKit"
        width={924}
        height={205}
        priority={priority}
        className={`brand-logo-hero ${className}`.trim()}
      />
    );
  }

  return (
    <Image
      src="/answerkit-logo-horizontal.png"
      alt="AnswerKit — Find answers. Fast."
      width={924}
      height={205}
      priority={priority}
      className={`brand-logo-full ${className}`.trim()}
    />
  );
}
