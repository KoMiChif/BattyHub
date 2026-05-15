"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { useAuth } from "@/lib/auth-store";
import { login } from "@/lib/auth-api";
import styles from "../account.module.css";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/account";
  const setSession = useAuth((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { data, error } = await login(email, password);
    setBusy(false);
    if (error || !data) {
      setError(error ?? "Could not sign in");
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
          <h1 className={styles.title}>Sign in.</h1>
          <p className={styles.subtitle}>
            Welcome back. Check out faster and track your orders.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBox}>{error}</div>}

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
              <label className="bh-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="bh-input"
                type="password"
                required
                autoComplete="current-password"
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
              {busy ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p className={styles.altLine}>
            New to BattyHub? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Create account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
