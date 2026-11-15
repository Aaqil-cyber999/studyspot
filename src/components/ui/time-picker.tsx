"use client"

import { cn } from "cn"

/**
 * Shadcn-style time picker, typing only.
 *
 * Keeps the native `<input type="time">` so typing digits and moving between
 * segments with the arrow keys works, but every way of opening the platform
 * picker is removed: the browser's calendar indicator is hidden, there is no
 * clock button, and the keyboard shortcuts that pop the picker open
 * (Alt+ArrowUp/Down, F4) are suppressed.
 *
 * `value` / `onChange` use 24-hour `HH:mm` strings, which is what the input
 * element works with. Use {@link formatTimeLabel} to render a 12-hour label.
 */
function TimePicker({
  id,
  value,
  onChange,
  disabled,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  "aria-label"?: string
  "aria-describedby"?: string
}) {
  return (
    <div data-slot="time-picker" className={cn("relative w-[112px] shrink-0", className)}>
      <input
        id={id}
        data-slot="time-picker-input"
        type="time"
        step={60}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          // Alt+ArrowUp/Down and F4 open the native picker in Chromium/Safari.
          const opensPicker =
            event.key === "F4" || (event.altKey && (event.key === "ArrowDown" || event.key === "ArrowUp"))
          if (opensPicker) event.preventDefault()
        }}
        className={cn(
          "h-[38px] w-full rounded-[12px] border border-input bg-background pl-[10px] pr-[6px] py-[10px]",
          "cursor-text text-[13px] text-[#0f172a] tabular-nums outline-none",
          "accent-primary",
          "transition-shadow focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#94a3b8]",
          "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:pointer-events-none",
          "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
          "[&::-webkit-datetime-edit-text]:px-[1px] [&::-webkit-datetime-edit-text]:text-[#94a3b8]",
          "[&::-webkit-datetime-edit-hour-field]:rounded-[4px] [&::-webkit-datetime-edit-minute-field]:rounded-[4px]",
          "[&::-webkit-datetime-edit-hour-field:focus]:bg-[#fed7aa] [&::-webkit-datetime-edit-hour-field:focus]:text-[#9a3412]",
          "[&::-webkit-datetime-edit-minute-field:focus]:bg-[#fed7aa] [&::-webkit-datetime-edit-minute-field:focus]:text-[#9a3412]",
          "selection:bg-[#fed7aa] selection:text-[#9a3412]",
        )}
      />
    </div>
  )
}

/** 24-hour `HH:mm` -> `h:mm AM/PM` label (e.g. `08:00` -> `8:00 AM`). */
function formatTimeLabel(value: string): string {
  const [hourPart, minutePart = "00"] = value.split(":")
  const hour = Number(hourPart)
  if (!Number.isFinite(hour)) return value
  const meridiem = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minutePart.padStart(2, "0")} ${meridiem}`
}

export { TimePicker, formatTimeLabel }
