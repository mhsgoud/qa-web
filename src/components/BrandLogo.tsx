import Image from "next/image";
import { BrandWordmark } from "@/components/BrandIcon";

type Props = {
  variant?: "header" | "footer";
  className?: string;
  priority?: boolean;
};

/** Header: icon + CSS wordmark. Footer: full logo PNG. */
export function BrandLogo({ variant = "header", className = "", priority = false }: Props) {
  if (variant === "header") {
    return (
      <span className={`brand-lockup ${className}`.trim()}>
        <Image
          src="/answerkit-icon.png"
          alt=""
          width={389}
          height={314}
          priority={priority}
          aria-hidden
          className="brand-lockup-icon"
        />
        <BrandWordmark />
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
