"use client";

type Props = {
  checked?: boolean;
  onChange?: (v: boolean) => void;
  "aria-label"?: string;
};

export default function Toggle({ checked = false, onChange, ...rest }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={[
        "relative inline-flex h-6 w-10 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/35",
        checked ? "bg-accent" : "bg-border",
      ].join(" ")}
      {...rest}
    >
      <span
        className={[
          "inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[2px]",
        ].join(" ")}
      />
    </button>
  );
}
