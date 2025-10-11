import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginFullBg(): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log({ email, pw });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background full image */}
      <img
        src="https://i.pinimg.com/736x/16/ff/69/16ff69485589c1ddef19137fe74838c4.jpg"
        alt="Cloud sky"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay halus biar kontras */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* Card login */}
      <div className="relative w-full max-w-md rounded-[28px] shadow-2xl ring-1 ring-slate-200 bg-white/70 backdrop-blur-xl">
        {/* Header */}
        <div className="relative rounded-t-[28px] h-24 bg-gradient-to-b from-sky-200/70 to-transparent">
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 grid place-items-center">
            <div className="h-14 w-14 rounded-2xl bg-white/90 shadow-lg ring-1 ring-slate-200 grid place-items-center">
              <LogIn className="text-slate-700" size={22} />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-7 sm:px-8 pb-8 pt-10">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 text-center">
            Sign in with email
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1">
            Welcome back, please sign in to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-3">
            {/* Email */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-100/70 border border-slate-200 px-3 py-2 focus-within:ring-2 focus-within:ring-slate-300">
              <Mail size={18} className="text-slate-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-100/70 border border-slate-200 px-3 py-2 focus-within:ring-2 focus-within:ring-slate-300">
              <Lock size={18} className="text-slate-500" />
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="text-slate-500 hover:text-slate-700"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a href="/forgot" className="text-sm text-slate-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-neutral-900 text-white font-semibold hover:bg-black/90 active:scale-[0.99] transition"
            >
              Get Started
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
              <div className="absolute inset-x-0 -top-2 flex justify-center">
                <span className="px-3 text-xs text-slate-400 bg-white/60 backdrop-blur">
                  Or sign in with
                </span>
              </div>
            </div>

            {/* SSO */}
            <div className="grid grid-cols-3 gap-3">
              <SSOButton icon="https://www.svgrepo.com/show/475656/google-color.svg" />
              <SSOButton icon="https://www.svgrepo.com/show/448234/facebook.svg" />
              <SSOButton icon="https://www.svgrepo.com/show/452210/apple.svg" />
            </div>
          </form>

          {/* Link ke signup */}
          <p className="mt-6 text-sm text-center text-slate-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

interface SSOButtonProps {
  icon: string;
}

function SSOButton({ icon }: SSOButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className="h-11 rounded-xl bg-white/70 backdrop-blur border border-slate-200 shadow-sm hover:bg-white transition inline-flex items-center justify-center"
    >
      <img src={icon} alt="SSO" className="h-5 w-5" />
    </button>
  );
}
