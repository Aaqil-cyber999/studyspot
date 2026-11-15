"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";

const asset = (name: string) => `/assets/${name}.svg`;

const schema = z.object({
  name: z.string().min(1, "Enter your name"),
  university: z.string().min(1, "Enter your university"),
  email: z.string().email(),
  password: z.string().min(4, "Enter a password"),
});

export default function UniversityAdminRegisterPage() {
  const router = useRouter();
  const setRole = useAuthStore((s) => s.setRole);

  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Enter your details");
  const [showPassword, setShowPassword] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ name, university, email, password });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid input";
      setMessage(msg);
      toast.error(msg);
      return;
    }
    setMessage("Submitting request...");
    // Mock registration – in a real app you would call an API here
    // No immediate role assignment; user must be verified first

    setShowSuccessModal(true);
  }

  function handleModalClose() {
    setShowSuccessModal(false);
    router.push("/university-admin/login");
  }

  return (
    <main className="admin-login flex h-dvh w-full max-w-[412px] mx-auto flex-col overflow-hidden bg-white">
      <section className="flex h-dvh shrink-0 p-5 bg-[#F97316] justify-center items-center">
        <div className="relative w-full z-1 pt-[8px]">
          <h1 className="text-center text-[23px] font-normal leading-normal text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Register as University Admin
          </h1>

          <form className="mt-[16px] flex w-full flex-col gap-[18px] rounded-[24px] border border-[#fed7aa] bg-white p-[28px_24px] shadow-[0_4px_12px_rgba(66,20,8,0.06)]" onSubmit={submit} noValidate>
            {/* Name */}
            <div className="flex flex-col gap-0">
              <label htmlFor="admin-name" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Name
              </label>
              <div className="flex h-[58px] items-center gap-[12px] rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  <img src={asset("f1e0b")} alt="" className="block size-[18px]" />
                </span>
                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setMessage("Enter your details");
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                />
              </div>
            </div>

            {/* University */}
            <div className="flex flex-col gap-0">
              <label htmlFor="admin-university" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                University
              </label>
              <div className="flex h-[58px] items-center gap-[12px] rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  <img src={asset("f1e0b")} alt="" className="block size-[18px]" />
                </span>
                <input
                  id="admin-university"
                  name="university"
                  type="text"
                  placeholder="University of Example"
                  value={university}
                  onChange={(e) => {
                    setUniversity(e.target.value);
                    setMessage("Enter your details");
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
                    setMessage("Enter your details");
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-0">
              <label htmlFor="admin-password" className="mb-[10px] ml-[7px] block text-[13px] font-medium leading-normal text-[#0f172a]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Password
              </label>
              <div className="flex h-[58px] items-center gap-[12px] rounded-[14px] border border-[#fed7aa] p-[10px_14px]">
                <span className="grid size-[36px] flex-none place-items-center rounded-[10px] bg-[#feedd2]">
                  {/* Use the same lock icon as the login page */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#f97316" strokeWidth="1.5" />
                    <circle cx="12" cy="16" r="1" stroke="#f97316" strokeWidth="1.5" />
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage("Enter your details");
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-light leading-normal text-[#334155] outline-none"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                />
                {password.length > 0 && (
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex items-center justify-center text-gray-500" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[16px] border border-[#f97316] bg-[#f97316] px-[16px] py-[16px] text-[15px] font-medium leading-normal text-white transition-all duration-140 hover:bg-[#ea580c] hover:shadow-[0_6px_16px_rgba(194,65,12,0.2)] active:scale-[0.985] focus-visible:shadow-[0_0_0_3px_#ffffff,0_0_0_5px_#c2410c]">
              <UserPlus size={18} className="block size-[18px] text-white" />
              <span>Register</span>
            </button>

            {/* Link to login */}
            <div className="mt-1 text-center text-sm text-[#334155]">
              <span>
                Already have an account?
                <br />
                <a href="/university-admin/login" className="font-medium text-[#f97316] hover:underline block mt-1">
                  Sign in
                </a>
              </span>
            </div>
          </form>
        </div>
      </section>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="p-8 max-w-[320px] w-full">
          <DialogTitle className="mb-4">Request submitted</DialogTitle>
          <DialogDescription>Once verified, you can log in to the platform.</DialogDescription>
          <DialogClose>
            <button className="mt-4 w-full rounded-[12px] bg-[#f97316] px-4 py-2 text-white" onClick={handleModalClose}>
              OK
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  );
}
