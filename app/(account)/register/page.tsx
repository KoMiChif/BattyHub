"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/auth-store";
import { register, loginWithGoogle } from "@/lib/auth-api";
import styles from "../account.module.css";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  );
}

function RegisterInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/account";
  const setSession = useAuth((s) => s.setSession);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    const { data, error } = await register(email, password, name || undefined);
    setBusy(false);
    if (error || !data) {
      setError(error ?? "Could not create account");
      return;
    }
    setSession(data.user, data.token);
    router.push(next);
  }

  async function handleGoogle(credential: string) {
    setError(null);
    const { data, error } = await loginWithGoogle(credential);
    if (error || !data) {
      setError(error ?? "Google sign-in failed");
      return;
    }
    setSession(data.user, data.token);
    router.push(next);
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>← Home</Link>
        <Wordmark size={20} />
        <span />
      </header>

      <section className={styles.card}>
        <div className={styles.cardInner}>
          <h1 className={styles.title}>Create account.</h1>
          <p className={styles.subtitle}>
            Saves your address for next time and lets you track orders. Or skip — guest checkout works fine.
          </p>

          {error && <div className={styles.errorBox} style={{ marginBottom: 16 }}>{error}</div>}

          <GoogleSignInButton text="signup_with" onCredential={handleGoogle} />

          <div className={styles.divider}>
            <span /><span>or</span><span />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <label className="bh-label" htmlFor="name">Name (optional)</label>
              <input
                id="name"
                className="bh-input"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label className="bh-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="bh-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label className="bh-label" htmlFor="password">Password (min 8)</label>
              <input
                id="password"
                className="bh-input"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="bh-btn bh-btn--lg bh-btn--block"
              style={{ marginTop: 8 }}
            >
              {busy ? "Creating…" : "Create account →"}
            </button>
          </form>

          <p className={styles.altLine}>
            Already have one? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
