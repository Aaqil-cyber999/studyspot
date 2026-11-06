"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDown, ArrowLeft, ArrowUp, Check, Pencil, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AdminConfirmDialog } from "@/components/shared/admin-confirm-dialog";
import {
  OPTION_CATEGORY_LABELS,
  type AdminOption,
  type OptionCategory,
  useAdminOptionsStore,
} from "@/stores/admin-options-store";

const categories = Object.keys(OPTION_CATEGORY_LABELS) as OptionCategory[];
const optionSchema = z.string().trim().min(1, "Enter an option name").max(40, "Use 40 characters or fewer");

export default function AdminOptionsPage() {
  const router = useRouter();
  const options = useAdminOptionsStore((state) => state.options);
  const addOption = useAdminOptionsStore((state) => state.addOption);
  const renameOption = useAdminOptionsStore((state) => state.renameOption);
  const toggleOption = useAdminOptionsStore((state) => state.toggleOption);
  const deleteOption = useAdminOptionsStore((state) => state.deleteOption);
  const moveOption = useAdminOptionsStore((state) => state.moveOption);
  const [category, setCategory] = useState<OptionCategory>("wifi");
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminOption | null>(null);

  const groupedOptions = useMemo(
    () => options.filter((option) => option.category === category).sort((a, b) => a.order - b.order),
    [category, options]
  );

  function add() {
    const result = optionSchema.safeParse(newLabel);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Enter an option name");
      return;
    }
    if (groupedOptions.some((option) => option.label.toLowerCase() === result.data.toLowerCase())) {
      toast.error("That option already exists in this category");
      return;
    }
    addOption(category, result.data);
    setNewLabel("");
    toast.success(`${result.data} added`);
  }

  function saveRename(option: AdminOption) {
    const result = optionSchema.safeParse(editingLabel);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Enter an option name");
      return;
    }
    if (groupedOptions.some((item) => item.id !== option.id && item.label.toLowerCase() === result.data.toLowerCase())) {
      toast.error("That option already exists in this category");
      return;
    }
    renameOption(option.id, result.data);
    setEditingId(null);
    toast.success("Option renamed");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteOption(deleteTarget.id);
    toast.success(`${deleteTarget.label} deleted`);
    setDeleteTarget(null);
  }

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      <header className="flex items-center gap-3 px-6 pb-4 pt-8">
        <button type="button" onClick={() => router.back()} aria-label="Back to profile" className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <p className="text-xs font-medium text-orange-600">System configuration</p>
          <h1 className="text-xl font-semibold text-slate-900">Option management</h1>
        </div>
      </header>

      <div className="space-y-4 px-6 pb-[120px]">
        <section className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-900">Control student choices</p>
          <p className="mt-1 text-xs leading-5 text-orange-800">Active options appear in new student forms. Existing locations and historical reports keep their saved text when an option changes.</p>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Option categories">
          {categories.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={category === item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${category === item ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>
              {OPTION_CATEGORY_LABELS[item]}
            </button>
          ))}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{OPTION_CATEGORY_LABELS[category]}</h2>
              <p className="mt-1 text-xs text-slate-500">{groupedOptions.filter((option) => option.active).length} active · {groupedOptions.filter((option) => !option.active).length} inactive</p>
            </div>
            <Check className="size-4 text-orange-500" />
          </div>

          <div className="mt-4 flex gap-2">
            <input value={newLabel} onChange={(event) => setNewLabel(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") add(); }} placeholder="Add a new option" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
            <button type="button" onClick={add} className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2" aria-label="Add option"><Plus className="size-5" /></button>
          </div>

          <div className="mt-4 space-y-2">
            {groupedOptions.map((option, index) => (
              <OptionRow
                key={option.id}
                option={option}
                isFirst={index === 0}
                isLast={index === groupedOptions.length - 1}
                editing={editingId === option.id}
                editingLabel={editingLabel}
                onStartEdit={() => { setEditingId(option.id); setEditingLabel(option.label); }}
                onEditChange={setEditingLabel}
                onSaveEdit={() => saveRename(option)}
                onCancelEdit={() => setEditingId(null)}
                onToggle={() => { toggleOption(option.id); toast.success(`${option.label} ${option.active ? "deactivated" : "activated"}`); }}
                onDelete={() => setDeleteTarget(option)}
                onMoveUp={() => moveOption(option.id, "up")}
                onMoveDown={() => moveOption(option.id, "down")}
              />
            ))}
          </div>
        </section>
      </div>

      <AdminConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }} title={`Delete ${deleteTarget?.label ?? "this option"}?`} description="New student forms will no longer offer this option. Existing saved values and historical reports will remain unchanged." confirmLabel="Delete option" destructive onConfirm={confirmDelete} />
    </main>
  );
}

function OptionRow({ option, isFirst, isLast, editing, editingLabel, onStartEdit, onEditChange, onSaveEdit, onCancelEdit, onToggle, onDelete, onMoveUp, onMoveDown }: {
  option: AdminOption;
  isFirst: boolean;
  isLast: boolean;
  editing: boolean;
  editingLabel: string;
  onStartEdit: () => void;
  onEditChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className={`rounded-xl border p-3 ${option.active ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-75"}`}>
      <div className="flex items-center gap-2">
        {editing ? <input autoFocus value={editingLabel} onChange={(event) => onEditChange(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-orange-300 px-2.5 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-orange-100" /> : <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">{option.label}</span>}
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${option.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>{option.active ? "Active" : "Inactive"}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <div className="flex items-center gap-1">
          <button type="button" disabled={isFirst} onClick={onMoveUp} aria-label={`Move ${option.label} up`} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"><ArrowUp className="size-3.5" /></button>
          <button type="button" disabled={isLast} onClick={onMoveDown} aria-label={`Move ${option.label} down`} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"><ArrowDown className="size-3.5" /></button>
          <span className="ml-1 text-[10px] text-slate-400">Display order {option.order + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          {editing ? <><button type="button" onClick={onSaveEdit} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-50">Save</button><button type="button" onClick={onCancelEdit} className="rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100">Cancel</button></> : <button type="button" onClick={onStartEdit} aria-label={`Edit ${option.label}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-orange-50 hover:text-orange-700"><Pencil className="size-3.5" /></button>}
          <button type="button" onClick={onToggle} aria-label={`${option.active ? "Deactivate" : "Activate"} ${option.label}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-orange-50 hover:text-orange-700">{option.active ? <ToggleLeft className="size-4" /> : <ToggleRight className="size-4" />}</button>
          <button type="button" onClick={onDelete} aria-label={`Delete ${option.label}`} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="size-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
