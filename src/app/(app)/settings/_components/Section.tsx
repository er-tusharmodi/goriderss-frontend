import { PropsWithChildren } from "react";

export default function Section({
  title,
  children,
  accent,
}: PropsWithChildren<{ title: string; accent?: string }>) {
  return (
    <div className="space-y-4">
      <h2 className={["font-semibold text-lg", accent ?? ""].join(" ")}>{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
