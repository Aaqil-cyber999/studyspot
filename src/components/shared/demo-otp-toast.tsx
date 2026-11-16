import toast from "react-hot-toast";

/**
 * Shows the dev "demo code" toast with two lines; the second line is centered:
 *
 *   OTP sent to someone@example.com
 *          (demo code: 123456)
 */
export function showDemoOtpToast(email: string, code: string) {
  toast.success(
    <span className="block text-center leading-5">
      OTP sent to {email}
      <br />
      <span className="block text-center">(demo code: {code})</span>
    </span>,
  );
}
