"use client";

import { useMemo, useState } from "react";
import { Check, GraduationCap, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { api } from "@/services/api";

interface UniversityOption {
  id: string;
  name: string;
  status: "Pending" | "Active" | "Inactive";
}

async function fetchActiveUniversities(): Promise<UniversityOption[]> {
  const all = await api.get<UniversityOption[]>("/universities");
  return all.filter((university) => university.status === "Active");
}

interface SelectUniversityDialogProps {
  /** Highlight the row red when the user tried to submit without picking one. */
  error?: boolean;
  /** Shake the row briefly to signal the error. */
  shake?: boolean;
}

/**
 * Modal university picker used on the student onboarding "Your details" page:
 * a searchable list of active universities (names only) instead of a separate page.
 */
export function SelectUniversityDialog({ error = false, shake = false }: SelectUniversityDialogProps) {
  const setUniversity = useOnboardingStore((state) => state.setUniversity);
  const university = useOnboardingStore((state) => state.university);
  const universityId = useOnboardingStore((state) => state.universityId);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: universities = [], isPending } = useQuery({
    queryKey: ["student", "onboarding-universities"],
    queryFn: fetchActiveUniversities,
  });

  const filtered = useMemo(
    () => universities.filter((u) => u.name.toLowerCase().includes(query.trim().toLowerCase())),
    [universities, query],
  );

  function choose(option: UniversityOption) {
    setUniversity(option.name, option.id);
    toast.success(`${option.name} selected`);
    setOpen(false);
    setQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className={`flex h-[58px] w-full cursor-pointer items-center gap-[12px] overflow-clip rounded-[14px] border bg-white px-[14px] py-[10px] transition-colors hover:bg-[#fdfaf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] ${
              error
                ? "border-red-500"
                : "border-[#fed7aa]"
            } ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
          />
        }
      >
        <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#feedd2]">
          <GraduationCap className="size-[18px] text-[#f97316]" aria-hidden="true" />
        </div>
        <span
          className={`min-w-0 flex-1 truncate text-left text-[15px] font-light ${
            university ? "text-black" : "text-[#989FA9]"
          }`}
        >
          {university || "Select university"}
        </span>
      </DialogTrigger>

      <DialogContent
        className="w-[90vw] max-w-[340px] gap-4 rounded-[16px] border border-[#e2e8f0] p-5"
        aria-describedby={undefined}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <GraduationCap aria-hidden="true" className="size-[18px] shrink-0 text-[#f97316]" strokeWidth={1.5} />
            <DialogTitle className="font-heading text-[17px] leading-6 font-semibold text-[#0f172a]">
              Select university
            </DialogTitle>
          </div>

          <DialogClose
            aria-label="Close dialog"
            className="flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white p-1 text-[#334155] transition-colors hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
          >
            <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </DialogClose>
        </div>

        <DialogDescription className="sr-only">Choose the university you study at</DialogDescription>

        <div className="flex items-center gap-[10px] rounded-[14px] border border-[#e2e8f0] bg-white px-[14px] py-[10px] focus-within:border-[#f97316] focus-within:ring-2 focus-within:ring-[#f97316]/30">
          <Search className="size-[18px] shrink-0 text-[#64748b]" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search university"
            aria-label="Search universities"
            className="min-w-0 flex-1 border-0 bg-transparent text-[14px] font-light text-[#334155] outline-none placeholder:text-[#989FA9]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full text-[#64748b] focus-visible:outline-2 focus-visible:outline-[#f97316]"
            >
              <X className="size-[14px]" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div
          role="listbox"
          aria-label="Universities"
          aria-busy={isPending}
          className="flex max-h-[300px] flex-col gap-[6px] overflow-y-auto"
        >
          {isPending ? (
            <div className="py-10 text-center text-[13px] text-[#64748b]">Loading universities…</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#64748b]">
              No universities match “{query}”.
            </div>
          ) : (
            filtered.map((universityOption) => {
              const selected = universityOption.id === universityId;

              return (
                <button
                  key={universityOption.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(universityOption)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] border px-[14px] py-[10px] text-left text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] ${
                    selected
                      ? "border-[#f97316] bg-[#fff7ed] text-[#c2410c]"
                      : "border-transparent bg-white text-[#334155] hover:bg-[#f8fafc]"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate font-medium">{universityOption.name}</span>
                  {selected ? <Check aria-hidden="true" className="size-[16px] shrink-0 text-[#f97316]" strokeWidth={2.5} /> : null}
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
