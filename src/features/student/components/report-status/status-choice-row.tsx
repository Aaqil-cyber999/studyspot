"use client";

interface StatusChoiceRowProps {
  /** Visible row label, also used as the accessible group name. */
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * One labelled row of mutually exclusive status chips (Figma "Row / …").
 */
export function StatusChoiceRow({ label, options, value, onChange }: StatusChoiceRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border border-[#e2e8f0] px-[16px] py-[14px]">
      <p className="text-[14px] font-normal leading-[20px] text-[#334155]">{label}</p>

      <div role="group" aria-label={label} className="flex flex-wrap items-start gap-[8px]">
        {options.map((option) => {
          const active = option === value;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={`flex h-[36px] items-center rounded-[18px] px-[14px] py-[8px] text-[13px] font-medium leading-[20px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 ${
                active
                  ? "bg-[#f97316] text-white"
                  : "bg-[#ddd] text-[#334155] hover:bg-[#d0d0d0]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
