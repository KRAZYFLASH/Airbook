// src/pages/SignupClean.tsx
import React, { useMemo, useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface FieldProps {
  icon: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  invalid?: boolean;
  className?: string;
}

function Field({
  icon,
  right,
  children,
  invalid = false,
  className = "",
}: FieldProps): React.ReactElement {
  return (
    <div
      className={[
        "relative flex items-center gap-2 rounded-xl border px-3 h-11",
        "bg-slate-100/70 border-slate-200 focus-within:ring-2 focus-within:ring-slate-300",
        invalid && "border-red-400 focus-within:ring-red-200",
        className,
      ].join(" ")}
    >
      <span className="text-slate-500 shrink-0">{icon}</span>
      {children}
      {right ? <div className="ml-auto shrink-0">{right}</div> : null}
    </div>
  );
}

export default function SignupClean(): React.ReactElement {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accept, setAccept] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4);
  }, [pw]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!accept) {
      alert("Please accept the terms and conditions");
      return;
    }

    if (pw !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(name, email, pw, confirm);

      if (result.success) {
        // Redirect to home after successful registration
        navigate('/', { replace: true });
      } else {
        alert(`Signup failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
      // Reset form on error only (success will redirect)
      setName("");
      setEmail("");
      setPw("");
      setConfirm("");
      setAccept(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* FULL BG */}
      <img
        src="https://i.pinimg.com/736x/16/ff/69/16ff69485589c1ddef19137fe74838c4.jpg"
        alt="Cloud sky"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* CARD: lebar, tidak memanjang */}
      <div className="relative w-full max-w-3xl rounded-[28px] shadow-2xl ring-1 ring-white/60 bg-white/70 backdrop-blur-xl">
        {/* Header mini gradient + icon */}
        <div className="relative rounded-t-[28px] h-20 bg-gradient-to-b from-sky-200/70 to-transparent">
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 grid place-items-center">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 grid place-items-center">
              <LogIn size={20} className="text-slate-700" />
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 pt-10 pb-8">
          <h1 className="text-2xl font-semibold text-slate-900 text-center">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1">
            Gratis, cepat, dan aman.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            {/* GRID 2 kolom di desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Field icon={<User size={18} />}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
                />
              </Field>

              <Field icon={<Mail size={18} />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Field
                icon={<Lock size={18} />}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="text-slate-500 hover:text-slate-700"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              >
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Kata sandi"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-700 appearance-none pr-10"
                />
              </Field>

              <Field
                icon={<Lock size={18} />}
                right={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="text-slate-500 hover:text-slate-700"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Konfirmasi kata sandi"
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-700 appearance-none pr-10"
                />
              </Field>

            </div>

            {/* Strength mini */}
            <div className="px-1">
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all ${["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-blue-600"][strength]
                    }`}
                  style={{ width: `${(strength + 1) * 20}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {["Lemah", "Cukup", "Baik", "Kuat", "Sangat Kuat"][strength]}
              </div>
            </div>

            {/* Terms + CTA */}
            <div className="flex flex-col gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={accept}
                  onChange={(e) => setAccept(e.target.checked)}
                  className="size-4 rounded border-slate-300"
                />
                Saya setuju dengan{" "}
                <a href="/terms" className="text-blue-600 underline">S&K</a>{" "}
                dan{" "}
                <a href="/privacy" className="text-blue-600 underline">Kebijakan Privasi</a>.
              </label>

              <button
                type="submit"
                disabled={!accept || isSubmitting}
                className="h-12 rounded-2xl bg-neutral-900 text-white font-semibold hover:bg-black/90 disabled:opacity-60 transition"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </div>

            {/* Divider + SSO */}
            <div className="relative my-1">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
              <div className="absolute inset-x-0 -top-2 flex justify-center">
                <span className="px-3 text-xs text-slate-400 bg-white/60 backdrop-blur">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SSOButton icon="https://www.svgrepo.com/show/475656/google-color.svg" />
              <SSOButton icon="https://www.svgrepo.com/show/448234/facebook.svg" />
              <SSOButton icon="https://www.svgrepo.com/show/452210/apple.svg" />
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-slate-600">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </button>
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
