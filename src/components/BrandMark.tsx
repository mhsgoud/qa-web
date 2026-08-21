"use client";

import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
  title?: string;
};

/** Crisp AnswerKit mark — chat bubble with cutout A. */
export function BrandMark({ size = 40, className = "", title }: Props) {
  const uid = useId().replace(/:/g, "");
  const gradId = `akMarkGrad-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-mark ${className}`.trim()}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={gradId} x1="6" y1="2" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4AD0F8" />
          <stop offset="0.4" stopColor="#1A6FD4" />
          <stop offset="1" stopColor="#08305F" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M34 5c13.8 0 25 10.55 25 23.55 0 8.85-4.9 16.65-12.35 20.85l3.25 8.55c.45.95-.45 2-1.5 1.7l-14.2-4.35C20.1 54.5 9 42.35 9 28.55 9 15.55 20.2 5 34 5Z"
      />
      <rect x="17" y="22" width="12.5" height="3.1" rx="1.55" fill="#F2F9FF" fillOpacity="0.95" />
      <rect x="17" y="28.5" width="8" height="3.1" rx="1.55" fill="#F2F9FF" fillOpacity="0.72" />
      <path
        fill="#F4F7FB"
        fillRule="evenodd"
        d="M29.2 46.5 38.55 18h5.35l9.35 28.5h-5.55l-1.85-5.9H36.6l-1.85 5.9h-5.55Zm8.55-10.85h7.35L41.4 23.4h-.15L37.75 35.65Z"
      />
    </svg>
  );
}
