import type { AnswerContent } from "@/lib/types";

const LABELS: Record<AnswerContent["status"], string> = {
  draft: "Draft",
  reviewed: "Reviewed",
  published: "Published",
};

export function StatusBadge({ status }: { status: AnswerContent["status"] }) {
  return <span className={`status-badge status-${status}`}>{LABELS[status]}</span>;
}
