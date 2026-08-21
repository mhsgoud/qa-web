import { BrandMark } from "@/components/BrandMark";

type Props = {
  size?: number;
  className?: string;
};

/** Speech-bubble mark for compact placements. */
export function BrandIcon({ size = 44, className = "" }: Props) {
  return <BrandMark size={size} className={className} />;
}
