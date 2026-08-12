import type { ReactNode } from "react";

export function SectionHeading({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <h2 className="section-heading">
      <span className="section-heading-icon">{icon}</span>
      {children}
    </h2>
  );
}
