"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Search, ShieldCheck, ShieldOff, X } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import { PageLoader } from "@/components/shared/page-loader";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSaUniversities, createSaUniversity, setSaUniversityStatus } from "@/services/super-admin";

type UniversityFilter = "All" | "Active" | "Inactive";

const createUniversitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a university name")
    .max(120, "Use 120 characters or fewer")
    .transform((value) => value.replace(/\s+/g, " ")),
});

export default function SaUniversitiesPage() {
  const queryClient = useQueryClient();
  const { data: universities = [], isPending } = useQuery({
    queryKey: ["sa", "universities"],
    queryFn: getSaUniversities,
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Active" | "Inactive" }) =>
      setSaUniversityStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sa", "universities"] });
      void queryClient.invalidateQueries({ queryKey: ["sa", "overview"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Unable to update the university."),
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<UniversityFilter>("All");
  const [target, setTarget] = useState<{ id: string; name: string; status: string } | null>(null);
  // Mirror the last opened target so the closing frame doesn't flash
  // "Activate undefined?" during the dialog's exit animation.
  const [shown, setShown] = useState(target);
  const [createOpen, setCreateOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftEnabled, setDraftEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function openDialog(next: NonNullable<typeof target>) {
    setTarget(next);
    setShown(next);
  }

  const createMutation = useMutation({
    mutationFn: ({ name, status }: { name: string; status: "Active" | "Inactive" }) =>
      createSaUniversity({ name, status }),
    onSuccess: (created) => {
      toast.success(`${created.name} created`);
      void queryClient.invalidateQueries({ queryKey: ["sa", "universities"] });
      void queryClient.invalidateQueries({ queryKey: ["sa", "overview"] });
      setCreateOpen(false);
      setDraftName("");
      setDraftEnabled(true);
      setError(null);
    },
    onError: (error) => {
      const message =
        error instanceof Error && error.message.includes("already exists")
          ? "That university already exists."
          : error instanceof Error
            ? error.message
            : "Unable to create the university.";
      setError(message);
      toast.error(message);
    },
  });

  function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createUniversitySchema.safeParse({ name: draftName });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Enter a university name";
      setError(message);
      toast.error(message);
      return;
    }
    createMutation.mutate({ name: parsed.data.name, status: draftEnabled ? "Active" : "Inactive" });
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredUniversities = useMemo(
    () =>
      universities.filter((university) => {
        const matchesQuery =
          !normalizedQuery ||
          `${university.name} ${university.adminName ?? ""}`.toLowerCase().includes(normalizedQuery);
        const matchesFilter = filter === "All" || university.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [universities, filter, normalizedQuery],
  );

  const activeCount = universities.filter((university) => university.status === "Active").length;

  function confirmStatusChange() {
    if (!target) return;
    const nextStatus = target.status === "Active" ? "Inactive" : "Active";
    toggleMutation.mutate(
      { id: target.id, status: nextStatus },
      {
        onSuccess: () =>
          toast.success(nextStatus === "Active" ? `${target.name} activated` : `${target.name} deactivated`),
      },
    );
    setTarget(null);
  }

  if (isPending) {
    return <PageLoader className="min-h-screen bg-[#E2E8F0]" />;
  }

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 sm:px-6">
      <header className="flex items-start justify-between gap-3 pb-4 pt-[16px]">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-[#0f172a]">Universities</h1>
          <p className="mt-1 text-xs text-[#64748b]">
            {universities.length} universities · {activeCount} active
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="mt-3 flex shrink-0 items-center gap-1.5 rounded-full bg-[#f97316] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Create university</span>
          <span className="sm:hidden">Create</span>
        </button>
      </header>

      <div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <Search className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search universities</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search universities or admins"
            className="min-w-0 flex-1 bg-white text-sm outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter universities by status">
          {(["All", "Active", "Inactive"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f97316] ${
                filter === item
                  ? "bg-orange-500 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-[#fafafa]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-4 pt-3">
        {filteredUniversities.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#ffdbca] text-[#f97316]">
              <Building2 className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#0f172a]">No universities found</p>
            <p className="mt-1 text-[13px] text-[#64748b]">
              {normalizedQuery ? "Try a different name or clear the search." : "Try another filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-[12px]">
            {filteredUniversities.map((university) => (
              <div
                key={university.id}
                className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between gap-3 p-[14px]">
                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold leading-5 text-[#0f172a]">{university.name}</p>
                    <p className="mt-1 text-[13px] text-[#64748b]">{university.locationCount} locations</p>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-[6px] rounded-full px-3 py-1.5 text-[11px] font-medium ${
                        university.status === "Active" ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#475569]"
                      }`}
                    >
                      <span className={`size-2 rounded-full ${university.status === "Active" ? "bg-[#15803d]" : "bg-[#94a3b8]"}`} aria-hidden="true" />
                      {university.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-2.5 py-2.5">
                  <p className="min-w-0 truncate text-[13px] text-[#64748b]">Admin: {university.adminName ?? "—"}</p>
                  <button
                    type="button"
                    onClick={() => openDialog({ id: university.id, name: university.name, status: university.status })}
                    disabled={toggleMutation.isPending}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:opacity-60 ${
                      university.status === "Active"
                        ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] hover:bg-[#fee2e2]"
                        : "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7]"
                    }`}
                  >
                    {university.status === "Active" ? (
                      <ShieldOff className="size-3" aria-hidden="true" />
                    ) : (
                      <ShieldCheck className="size-3" aria-hidden="true" />
                    )}
                    {university.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) {
            setDraftName("");
            setDraftEnabled(true);
            setError(null);
          }
        }}
      >
        <DialogContent className="gap-4 rounded-[16px] border border-[#e2e8f0] p-5">
          <form onSubmit={submitCreate} className="flex w-full flex-col gap-4" noValidate>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Building2 aria-hidden="true" className="size-[18px] shrink-0 text-[#f97316]" strokeWidth={1.5} />
                <DialogTitle className="font-heading text-[17px] leading-6 font-semibold text-[#0f172a]">
                  Create university
                </DialogTitle>
              </div>
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Close dialog"
                    className="size-[26px] shrink-0 rounded-[8px] border-[#e2e8f0] bg-white p-1 text-[#334155] hover:bg-[#f8fafc] focus-visible:ring-2 focus-visible:ring-[#f97316]"
                  />
                }
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </DialogClose>
            </div>

            <DialogDescription id={`create-university-form`} className="sr-only">
              Create a new university and choose whether it is visible to students.
            </DialogDescription>

            <div className="flex w-full flex-col gap-[10px]">
              <label
                htmlFor="university-name"
                className="w-full font-heading text-[13px] leading-4 font-medium text-[#334052]"
              >
                University name
              </label>
              <input
                id="university-name"
                name="name"
                type="text"
                autoFocus
                placeholder="University of Peradeniya"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "create-university-error" : undefined}
                maxLength={120}
                className="w-full rounded-[12px] border border-[#e2e8f0] bg-white px-4 py-[13px] font-heading text-[15px] leading-[19px] font-normal text-black placeholder:text-[#94a3b8] outline-none focus-visible:border-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/30 aria-invalid:border-[#dc2626]"
              />
            </div>

            <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f172a]">Enabled</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {draftEnabled ? "Visible to students" : "Hidden from students"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={draftEnabled}
                aria-label={draftEnabled ? "Disable university" : "Enable university"}
                onClick={() => setDraftEnabled((value) => !value)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  draftEnabled ? "bg-orange-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`student-keep-light absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all ${
                    draftEnabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {error ? (
              <p id="create-university-error" role="alert" className="font-body text-[11px] leading-4 text-[#dc2626]">
                {error}
              </p>
            ) : null}

            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="min-h-10 min-w-0 flex-1 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="min-h-10 min-w-0 flex-1 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {createMutation.isPending ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={shown?.status === "Active" ? "Deactivate university" : "Activate university"}
        description={
          shown
            ? shown.status === "Active"
              ? `Deactivate ${shown.name}? Its study locations will be hidden from students until it is reactivated.`
              : `Activate ${shown.name}? Its study locations will become available to students again.`
            : ""
        }
        confirmLabel={shown?.status === "Active" ? "Deactivate" : "Activate"}
        destructive={shown?.status === "Active"}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}
