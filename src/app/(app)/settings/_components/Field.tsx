import { SelectHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from "react";

export function FieldLabel({ children }: PropsWithChildren) {
  return <span className="text-textmuted text-sm">{children}</span>;
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none",
        "focus:border-accent focus:ring-4 focus:ring-accent/35",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none",
        "focus:border-accent focus:ring-4 focus:ring-accent/35",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function CardRow({ children }: PropsWithChildren) {
  return (
    <div className="bg-white/5 border border-border rounded-xl p-4">{children}</div>
  );
}
