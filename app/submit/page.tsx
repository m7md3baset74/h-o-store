"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.18))" }} />
      <div style={{ width: 3, height: 3, background: "#c9a84c", transform: "rotate(45deg)", opacity: 0.4 }} />
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.18), transparent)" }} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(201,168,76,0.70)" }}>{label}</p>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.028)", border: "1px solid rgba(201,168,76,0.12)",
  borderRadius: 8, padding: "11px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: 13,
  fontWeight: 300, color: "rgba(255,255,255,0.75)", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};

function TextInput({ placeholder, value, onChange, type = "text" }: { placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? "rgba(201,168,76,0.65)" : "rgba(201,168,76,0.12)" }} />
  );
}

function PasswordInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle, paddingRight: 42, borderColor: focused ? "rgba(201,168,76,0.65)" : "rgba(201,168,76,0.12)" }} />
      <button type="button" onClick={() => setShow(s => !s)}
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(201,168,76,0.5)", padding: 0, display: "flex" }}>
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ─── Backup Instructions Accordion ───────────────────────────────────────────
function BackupInstructions() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 8, border: "1px solid rgba(201,168,76,0.12)", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", padding: "10px 14px", background: "rgba(201,168,76,0.04)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 400, color: "rgba(201,168,76,0.8)", letterSpacing: "0.04em" }}>
          How to get backup codes?
        </span>
        {open
          ? <ChevronUp size={13} style={{ color: "rgba(201,168,76,0.5)" }} />
          : <ChevronDown size={13} style={{ color: "rgba(201,168,76,0.5)" }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(201,168,76,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
                3 Backup codes are needed to start your order.
              </p>
              <ol style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  <>Go to <a href="https://myaccount.ea.com/am/ui/security-privacy" target="_blank" style={{ color: "rgba(201,168,76,0.65)", textDecoration: "underline", textUnderlineOffset: 3 }}>EA Security Settings</a></>,
                  <>Click on <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>"Two Factor Authentication"</strong> arrow</>,
                  <>Click on <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>"View backup codes"</strong></>,
                  "Copy the backup codes 1, 2 and 3 into the fields below.",
                  "If you've already used one, you can create new codes using the corresponding button.",
                ].map((step, i) => (
                  <li key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.78)", lineHeight: 1.65 }}>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href="https://youtu.be/5hM9REwRZuE"
                target="_blank"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(201,168,76,0.6)", textDecoration: "none", marginTop: 2 }}>
                <ExternalLink size={11} />
                Tutorial Video
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Submit Form ──────────────────────────────────────────────────────────────
function SubmitForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const link = searchParams.get("link") || "";

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [ba1, setBa1] = useState("");
  const [ba2, setBa2] = useState("");
  const [ba3, setBa3] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!link) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
      Invalid link. Please contact support.
    </div>
  );

  const handleSubmit = async () => {
    setError("");
    if (!user.trim() || !pass.trim() || !ba1.trim()) { setError("Please fill in all required fields."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link, name: "Customer", platform: "PS", user, pass, ba1, ba2, ba3 }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      router.push(`/order/${data.orderID}?verify=${data.verify}&oid=${data.orderID}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,168,76,0.60)", marginBottom: 4 }}>Transfer Order</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 22, color: "#c9a84c", letterSpacing: "0.04em" }}>Account Details</h1>
      </div>

      <GoldDivider />

      {/* Instructions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          "Ensure to Exit ultimate team before you close your game.",
          "Ensure your account has no unassigned items before submitting.",
          "Ensure to have 10k coins in your account.",
        ].map((text, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(201,168,76,0.5)", flexShrink: 0, marginTop: 5 }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      <GoldDivider />

      {/* EA Credentials */}
      <Field label="EA Email">
        <TextInput placeholder="your@email.com" value={user} onChange={setUser} type="email" />
      </Field>

      <Field label="EA Password">
        <PasswordInput placeholder="Your EA password" value={pass} onChange={setPass} />
      </Field>

      <GoldDivider />

      {/* Backup Codes */}
      <BackupInstructions />

      <Field label="Backup Code 1 — Required">
        <TextInput placeholder="Backup code" value={ba1} onChange={setBa1} />
      </Field>

      <Field label="Backup Code 2 — Required">
        <TextInput placeholder="Backup code" value={ba2} onChange={setBa2} />
      </Field>

      <Field label="Backup Code 3 — Required">
        <TextInput placeholder="Backup code" value={ba3} onChange={setBa3} />
      </Field>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderLeft: "2px solid rgba(239,68,68,0.85)", borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(239,68,68,0.7)", lineHeight: 1.5 }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Processing</> : "Submit Transfer"}
      </button>

      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 300, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.6 }}>
        After submission you will be redirected to your live order status page.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SubmitPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        .lux-page { min-height: 100vh; background: radial-gradient(ellipse 90% 50% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 15% 60%, rgba(201,168,76,0.025) 0%, transparent 50%), #080808; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 16px; gap: 20px; position: relative; overflow: hidden; }
        .lux-page::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); opacity: 0.65; pointer-events: none; }
        .lux-card { background: linear-gradient(150deg, rgba(201,168,76,0.045) 0%, rgba(201,168,76,0.01) 25%, rgba(10,10,10,0.98) 55%), #0d0d0d; border: 1px solid rgba(201,168,76,0.1); box-shadow: 0 0 0 1px rgba(201,168,76,0.04), 0 40px 100px rgba(0,0,0,0.85), inset 0 1px 0 rgba(201,168,76,0.09); border-radius: 18px; width: 100%; max-width: 480px; overflow: hidden; position: relative; z-index: 10; }
        .lux-rule-top { height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.8) 50%, rgba(201,168,76,0.5) 70%, transparent 100%); }
        .monogram-box { background: radial-gradient(ellipse 80% 65% at 50% 45%, rgba(201,168,76,0.07) 0%, transparent 70%), rgba(201,168,76,0.025); border: 1px solid rgba(201,168,76,0.12); border-radius: 12px; padding: 14px 36px 10px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.08) 100%); border: 1px solid rgba(201,168,76,0.4); border-radius: 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase; color: #c9a84c; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .submit-btn:hover:not(:disabled) { background: linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.12) 100%); border-color: rgba(201,168,76,0.5); box-shadow: 0 0 20px rgba(201,168,76,0.1); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="lux-page">
        <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div className="monogram-box">
            <motion.span initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontWeight: 300, fontSize: 58, lineHeight: 1, letterSpacing: "0.05em", color: "#e8d5a3" }}>HO</motion.span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 400, letterSpacing: "0.48em", textTransform: "uppercase", color: "rgba(201,168,76,0.70)" }}>STORE</span>
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(201,168,76,0.72)" }}>Private Transfer Service</span>
        </motion.div>

        <motion.div className="lux-card" initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}>
          <div className="lux-rule-top" />
          <div style={{ padding: "22px 24px 24px" }}>
            <Suspense fallback={<p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Loading...</p>}>
              <SubmitForm />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </>
  );
}