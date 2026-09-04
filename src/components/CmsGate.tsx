"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import styles from "./CmsGate.module.css";

type Mode = "login" | "first-user" | "error";

type Props = {
  mode: Mode;
  message?: string;
};

async function postJson(path: string, body: Record<string, string>) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
    errors?: { message?: string }[];
  };
  if (!response.ok) {
    const fromErrors = data.errors?.map((item) => item.message).filter(Boolean).join(" ");
    throw new Error(fromErrors || data.message || `Error ${response.status}`);
  }
}

export function CmsGate({ mode, message }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(message ?? "");

  const firstUser = mode === "first-user";
  const unavailable = mode === "error";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (unavailable) {
      window.location.reload();
      return;
    }
    if (firstUser && password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (firstUser) {
        await postJson("/api/users/first-register", { email, password, name });
      } else {
        await postJson("/api/users/login", { email, password });
      }
      window.location.assign("/admin/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo entrar.");
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img
          src={siteConfig.logo}
          alt={siteConfig.name}
          className={styles.logo}
          width={180}
          height={48}
        />
        <p className={styles.kicker}>PGT CMS</p>
        <h1 className={styles.title}>
          {unavailable ? "El CMS se está despertando" : firstUser ? "Crear el primer admin" : "Entrar al CMS"}
        </h1>
        <p className={styles.lead}>
          {unavailable
            ? "Neon free a veces tarda unos segundos en frío. Recarga y entra de nuevo."
            : firstUser
              ? "Esta cuenta queda como admin. Úsala para Lizet y el equipo — no es el sitio público."
              : "Catálogo EN / ES / PT. Los cambios se publican en next.perugrandtravel.com."}
        </p>
        {error ? <p className={styles.error}>{error}</p> : null}
        <form className={styles.form} onSubmit={onSubmit}>
          {unavailable ? null : (
            <>
              {firstUser ? (
                <label className={styles.label}>
                  Nombre
                  <input
                    className={styles.input}
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Lizet / Jairo"
                  />
                </label>
              ) : null}
              <label className={styles.label}>
                Email
                <input
                  className={styles.input}
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@perugrandtravel.com"
                />
              </label>
              <label className={styles.label}>
                Contraseña
                <input
                  className={styles.input}
                  type="password"
                  required
                  minLength={8}
                  autoComplete={firstUser ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {firstUser ? (
                <label className={styles.label}>
                  Confirmar contraseña
                  <input
                    className={styles.input}
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                  />
                </label>
              ) : null}
            </>
          )}
          <button className={styles.submit} type="submit" disabled={busy}>
            {busy ? "Entrando…" : unavailable ? "Reintentar" : firstUser ? "Crear admin y entrar" : "Entrar"}
          </button>
        </form>
        <p className={styles.foot}>
          <a href="/">← Sitio público</a>
          <span>noindex · next.</span>
        </p>
      </div>
    </main>
  );
}
