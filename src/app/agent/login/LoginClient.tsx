"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginAction } from "@/actions/auth";

export function LoginClient() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: null });
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="bg-bg-primary p-10 md:p-16 flex flex-col justify-between">
        <div>
          <Link href="/" className="block mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-landscape.png" alt="Prime Property" className="h-10 w-auto" />
          </Link>
          <p className="text-[11px] tracking-widest-2 uppercase text-white/40 mt-1">Agent Portal</p>
        </div>
        <p className="font-display italic text-2xl text-white/30 max-w-md leading-relaxed">
          &quot;Di balik setiap transaksi adalah kepercayaan yang dijaga.&quot;
        </p>
        <p className="text-xs text-white/20">© 2026 Prime Property · Internal Access Only</p>
      </div>

      <div className="bg-white p-10 md:p-16 flex items-center justify-center">
        <form action={formAction} className="w-full max-w-sm bg-white border border-[#E0E0E0] rounded-xl p-10 space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Login Agent</h1>
            <p className="text-sm text-text-muted mt-1">Masuk ke portal internal Prime Property.</p>
          </div>

          {state.error && (
            <div className="bg-red-50 border border-red-accent rounded-md p-3 flex gap-2 items-center text-sm text-red-accent">
              <AlertCircle className="w-4 h-4 shrink-0" /> {state.error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-text-primary block mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="email@primeproperty.id"
              className="w-full bg-bg-soft border border-[#E0E0E0] rounded-md px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-text-primary block mb-1.5">Password</label>
            <div className="relative">
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-bg-soft border border-[#E0E0E0] rounded-md px-3 py-2.5 pr-10 text-sm outline-none focus:border-gold"
              />
              <button type="button" onClick={() => setShow(!show)} aria-label="Toggle" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a href="#" className="text-[13px] text-gold hover:underline">Lupa password?</a>
          </div>

          <button
            type="submit" disabled={isPending}
            className={cn("w-full bg-gold text-text-primary py-3 rounded-md font-semibold text-[15px] hover:bg-gold-light transition-colors flex items-center justify-center gap-2", isPending && "opacity-70")}
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Masuk...</> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
