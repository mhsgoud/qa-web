import { BrandMark } from "@/components/BrandMark";

type Props = {
  variant?: "header" | "footer" | "hero";
  className?: string;
};

/** AnswerKit lockup — SVG mark + crisp CSS wordmark (no PNG aliasing). */
export function BrandLogo({ variant = "header", className = "" }: Props) {
  const markSize = variant === "hero" ? 64 : variant === "footer" ? 40 : 34;

  return (
    <span className={`brand-lockup brand-lockup-${variant} ${className}`.trim()}>
      <BrandMark size={markSize} />
      <span className="brand-wordmark" aria-label="AnswerKit">
        <span className="brand-word-answer">answer</span>
        <span className="brand-word-kit">kit</span>
      </span>
    </span>
  );
}
