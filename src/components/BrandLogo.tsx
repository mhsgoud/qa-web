import Image from "next/image";

type Props = {
  variant?: "header" | "footer";
  className?: string;
  priority?: boolean;
};

/** Header: icon + wordmark side by side. Footer: full lockup with tagline. */
export function BrandLogo({ variant = "header", className = "", priority = false }: Props) {
  if (variant === "header") {
    return (
      <span className={`brand-lockup ${className}`.trim()}>
        <Image
          src="/answerkit-icon.png"
          alt=""
          width={349}
          height={341}
          priority={priority}
          aria-hidden
          className="brand-lockup-icon"
        />
        <Image
          src="/answerkit-wordmark.png"
          alt="AnswerKit"
          width={779}
          height={116}
          priority={priority}
          className="brand-lockup-word"
        />
      </span>
    );
  }

  return (
    <Image
      src="/answerkit-logo.png"
      alt="AnswerKit — Find answers. Fast."
      width={1024}
      height={682}
      priority={priority}
      className={`brand-logo-full ${className}`.trim()}
    />
  );
}
