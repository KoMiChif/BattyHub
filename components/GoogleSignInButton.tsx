"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GsiInitConfig) => void;
          renderButton: (parent: HTMLElement, options: GsiButtonOptions) => void;
        };
      };
    };
  }
}

type GsiCredentialResponse = { credential: string };

type GsiInitConfig = {
  client_id: string;
  callback: (response: GsiCredentialResponse) => void;
  ux_mode?: "popup" | "redirect";
  auto_select?: boolean;
};

type GsiButtonOptions = {
  type: "standard" | "icon";
  theme: "outline" | "filled_blue" | "filled_black";
  size: "small" | "medium" | "large";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number | string;
};

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

let scriptLoaded: Promise<void> | null = null;

function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptLoaded) return scriptLoaded;

  scriptLoaded = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load GSI")));
      return;
    }
    const s = document.createElement("script");
    s.src = GSI_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load GSI"));
    document.head.appendChild(s);
  });
  return scriptLoaded;
}

type Props = {
  text?: "signin_with" | "signup_with" | "continue_with";
  onCredential: (credential: string) => void | Promise<void>;
};

export function GoogleSignInButton({ text = "continue_with", onCredential }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID) {
      setError("Google sign-in is not configured (missing NEXT_PUBLIC_GOOGLE_CLIENT_ID).");
      return;
    }
    let cancelled = false;
    loadGsiScript()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (resp) => onCredential(resp.credential),
        });
        window.google.accounts.id.renderButton(ref.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text,
          shape: "rectangular",
          logo_alignment: "left",
          width: 360,
        });
      })
      .catch(() => setError("Could not load Google sign-in."));
    return () => {
      cancelled = true;
    };
  }, [onCredential, text]);

  if (error) {
    return (
      <div
        style={{
          fontSize: 12,
          color: "var(--bh-gray-400)",
          padding: "10px 12px",
          border: "1px dashed var(--bh-gray-200)",
        }}
      >
        {error}
      </div>
    );
  }

  return <div ref={ref} style={{ display: "flex", justifyContent: "center" }} />;
}
