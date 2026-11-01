import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-sm text-slate-500">Page not found.</p>
      <Link href="/" className="mt-6 rounded-2xl bg-orange-500 px-6 py-3 font-medium text-white">
        Go home
      </Link>
    </div>
  );
}