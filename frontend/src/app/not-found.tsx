import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: "linear-gradient(135deg,#14218C 0%,#243AD1 45%,#5368F0 100%)" }}>
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="relative z-10 text-center">
        <p className="text-8xl font-black text-red-400 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
          <GraduationCap size={18} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
