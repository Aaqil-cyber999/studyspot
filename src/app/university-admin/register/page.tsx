"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import { GraduationCap, Loader2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, ApiError } from "@/services/api";

const asset = (name: string) => `/assets/${name}.svg`;

const TITLES = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  university: z.string().min(2, "Enter your university"),
  email: z.string().email("Enter a valid email address"),
});

export default function UniversityAdminRegisterPage() {
  const router = useRouter();

  const [title, setTitle] = useState("Mr");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ name, university, email });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid input";
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    // The request lands in the super-admin queue, exactly as this form
    // captures it (Title, Name, University, Email, Note).
    // The password is never stored.
    try {
      await api.post("/registration-requests", {
        title,
        name: name.trim(),
        university: university.trim(),
        email: email.trim(),
        note: note.trim() || undefined,
      });
      setShowSuccessModal(true);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : "Unable to submit the request. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handleModalClose() {
    setShowSuccessModal(false);
    router.push("/university-admin/login");
  }

  return (
    <main className="admin-login flex min-h-dvh w-full md:max-w-[412px] mx-auto flex-col overflow-y-auto bg-[#F97316]">
      <section className="grid min-h-dvh shrink-0 p-5 bg-[#F97316] justify-center items-center">
        <div className="relative w-full z-1 pt-[8px] m-auto">
          <h1 className="text-center text-[23px] font-normal leading-normal text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Register as University Admin
          </h1>

          <form className="mt-[16px] flex w-full flex-col gap-[18px] rounded-[24px] border border-[#fed7aa] bg-white p-[28px_24px] shadow-[0_4px_12px_rgba(66,20,8,0.06)]" onSubmit={submit} noValidate>
            {/* Title + Name */}
            <div className="flex gap-[10px]">
              <div className="flex w-[76px] flex-none flex-col gap-0">
                <Select value={title} onValueChange={(value) => {
                  setTitle(String(value));
                }} name="title">
                  <SelectLabel className="mb-[10px] ml-[7px] block cursor-pointer text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    Title
                  </SelectLabel>
                  <SelectTrigger
                    id="admin-title"
                    className="flex h-[58px] w-full cursor-pointer items-center justify-center gap-[2px] rounded-[14px] border border-[#fed7aa] bg-white p-[10px_8px] text-[15px] font-light leading-normal text-[#334155]"
                    style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-[132px]">
                    {TITLES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-0">
                <label htmlFor="admin-name" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Name
                </label>
                <div className="flex h-[58px] items-center rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                  <input
                    id="admin-name"
                    name="name"
                    type="text"
                    placeholder="Janith Perera"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                    style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                  />
                </div>
              </div>
            </div>

            {/* University */}
            <div className="flex flex-col gap-0">
              <label htmlFor="admin-university" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                University
              </label>
              <div className="flex h-[58px] items-center gap-[12px] rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  <GraduationCap size={18} strokeWidth={1.5} className="text-[#f97316]" aria-hidden />
                </span>
                <input
                  id="admin-university"
                  name="university"
                  type="text"
                  placeholder="University of Moratuwa"
                  value={university}
                  onChange={(e) => {
                    setUniversity(e.target.value);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-0">
              <label htmlFor="admin-email" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Email address
              </label>
              <div className="flex h-[58px] items-center gap-[12px] rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  <img src={asset("f1e0b")} alt="" className="block size-[18px]" />
                </span>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                />
              </div>
            </div>



            {/* Note */}
            <div className="flex flex-col gap-0">
              <label htmlFor="admin-note" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Note if any (optional)
              </label>
              <textarea
                id="admin-note"
                name="note"
                rows={3}
                placeholder="Anything we should know about your request…"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
                className="w-full resize-none rounded-[14px] border border-[#fed7aa] bg-white p-[10px_14px] text-[15px] font-light leading-normal text-[#334155] outline-none placeholder:text-[#94a3b8]"
                style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              />
            </div>

            {/* How sign-in works */}
            <p className="-mt-1 ml-[7px] text-[12px] leading-5 text-[#64748b]">
              No password needed here. Once your request is approved, a temporary password is issued for you to sign in.
            </p>

            {/* Submit */}
            <button type="submit" disabled={submitting} className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[16px] border border-[#f97316] bg-[#f97316] px-[16px] py-[16px] text-[15px] font-medium leading-normal text-white transition-all duration-140 hover:bg-[#ea580c] hover:shadow-[0_6px_16px_rgba(194,65,12,0.2)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:shadow-[0_0_0_3px_#ffffff,0_0_0_5px_#c2410c]">
              {submitting ? <Loader2 size={18} className="block size-[18px] animate-spin text-white" aria-hidden="true" /> : <UserPlus size={18} className="block size-[18px] text-white" />}
              <span>{submitting ? "Submitting…" : "Register"}</span>
            </button>

            {/* Link to login */}
            <div className="mt-1 text-center text-sm text-[#334155]">
              <span>
                Already have an account?{" "}
                <a href="/university-admin/login" className="font-medium text-[#f97316] hover:underline">
                  Sign in
                </a>
              </span>
            </div>
          </form>
        </div>
      </section>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="p-8 w-[90vw] md:w-[320px]">
          <DialogTitle className="mb-4">Request submitted</DialogTitle>
          <DialogDescription>Once verified, you can log in to the platform.</DialogDescription>
          <DialogClose>
            <button className="mt-4 min-h-10 w-full rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2" onClick={handleModalClose}>
              OK
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  );
}