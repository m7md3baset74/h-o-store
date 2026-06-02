"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, animate } from "framer-motion";
import {
  CheckCircle,
  Info,
  RotateCw,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Animated Number ──────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [value]);
  return <>{display}</>;
}

// ─── Luxury Progress Line ─────────────────────────────────────────────────────
function LuxuryProgress({ progress }: { progress: number }) {
  return (
    <div
      className="relative w-full"
      style={{ height: 8, display: "flex", alignItems: "center" }}
    >
      <div
        className="w-full h-[1px]"
        style={{ background: "rgba(201,168,76,0.12)" }}
      />
      <motion.div
        className="absolute top-1/2 left-0 h-[1px]"
        style={{
          translateY: "-50%",
          background:
            "linear-gradient(90deg, rgba(201,168,76,0.3), #c9a84c, #e8d5a3)",
          boxShadow:
            "0 0 8px rgba(201,168,76,0.5), 0 0 24px rgba(201,168,76,0.15)",
        }}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />
      <motion.div
        className="absolute top-1/2 w-1.5 h-1.5 rounded-full"
        style={{
          translateY: "-50%",
          translateX: "-50%",
          background: "#e8d5a3",
          boxShadow:
            "0 0 10px rgba(201,168,76,0.9), 0 0 20px rgba(201,168,76,0.4)",
        }}
        initial={{ left: "0%" }}
        animate={{ left: `${progress}%` }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />
    </div>
  );
}

// ─── Gold Divider ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        margin: "4px 0",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.18))",
        }}
      />
      <div
        style={{
          width: 3,
          height: 3,
          background: "#c9a84c",
          transform: "rotate(45deg)",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(90deg, rgba(201,168,76,0.18), transparent)",
        }}
      />
    </div>
  );
}

// ─── Alert Block (static, no form) ───────────────────────────────────────────
function AlertBlock({
  r,
  g,
  b,
  label,
  children,
}: {
  r: number;
  g: number;
  b: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: `rgba(${r},${g},${b},0.05)`,
        border: `1px solid rgba(${r},${g},${b},0.15)`,
        borderLeft: `2px solid rgba(${r},${g},${b},0.45)`,
        borderRadius: 8,
        padding: "12px 14px",
        marginBottom: 12,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 9,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: `rgba(${r},${g},${b},0.75)`,
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 12,
          fontWeight: 300,
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.65,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ─── Input style ──────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.028)",
  border: "1px solid rgba(201,168,76,0.12)",
  borderRadius: 8,
  padding: "10px 14px",
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 13,
  fontWeight: 300,
  color: "rgba(255,255,255,0.75)",
  outline: "none",
  boxSizing: "border-box",
};

// ─── Update Credentials Form ──────────────────────────────────────────────────
function UpdateCredentialsForm({
  orderID,
  verify,
  onSubmit,
  onSuccess,
  onError,
}: {
  orderID: string;
  verify: string;
  onSubmit: () => void;
  onSuccess: () => void;
  onError: () => void;
}) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!user.trim() || !pass.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    onSubmit();
    try {
      const res = await fetch("/api/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID,
          verify,
          updateType: "credentials",
          user,
          pass,
        }),
      });
      const data = await res.json();
      if (data.result?.trim() === "success") {
        onSuccess();
      } else {
        setError("Update failed. Please check your credentials.");
        onError();
      }
    } catch {
      setError("Network error. Please try again.");
      onError();
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(239,68,68,0.04)",
        border: "1px solid rgba(239,68,68,0.12)",
        borderLeft: "2px solid rgba(239,68,68,0.4)",
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: 12,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 9,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(239,68,68,0.7)",
          marginBottom: 6,
        }}
      >
        ⚠ Credentials Invalid
      </p>
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 12,
          fontWeight: 300,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.65,
          marginBottom: 12,
        }}
      >
        Your EA email or password is incorrect. Please enter the correct
        credentials.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          type="email"
          placeholder="EA Email"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={inputStyle}
        />
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="EA Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            style={{ ...inputStyle, paddingRight: 42 }}
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(201,168,76,0.4)",
              padding: 0,
              display: "flex",
            }}
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {error && (
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11,
              color: "rgba(239,68,68,0.65)",
            }}
          >
            {error}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(239,68,68,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={12}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Updating...
            </>
          ) : (
            "Update Credentials"
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Update Backup Form ───────────────────────────────────────────────────────
function UpdateBackupForm({
  orderID,
  verify,
  onSubmit,
  onSuccess,
  onError,
}: {
  orderID: string;
  verify: string;
  onSubmit: () => void;
  onSuccess: () => void;
  onError: () => void;
}) {
  const [ba1, setBa1] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!ba1.trim()) {
      setError("Please enter your backup code.");
      return;
    }
    setLoading(true);
    setError("");
    onSubmit();
    try {
      const res = await fetch("/api/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, verify, updateType: "ba1", ba1 }),
      });
      const data = await res.json();
      if (data.result?.trim() === "success") {
        onSuccess();
      } else {
        setError("Update failed. Please check your backup code.");
        onError();
      }
    } catch {
      setError("Network error. Please try again.");
      onError();
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(167,139,250,0.04)",
        border: "1px solid rgba(167,139,250,0.12)",
        borderLeft: "2px solid rgba(167,139,250,0.4)",
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: 12,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 9,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(167,139,250,0.7)",
          marginBottom: 6,
        }}
      >
        ⚠ Backup Code Required
      </p>
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 12,
          fontWeight: 300,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.65,
          marginBottom: 12,
        }}
      >
        One or more EA backup codes are invalid. Please enter a valid backup
        code from your{" "}
        <a
          href="https://myaccount.ea.com/cp-ui/security/index"
          target="_blank"
          style={{
            color: "rgba(167,139,250,0.65)",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          EA Security Settings →
        </a>
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          type="text"
          placeholder="Backup code"
          value={ba1}
          onChange={(e) => setBa1(e.target.value)}
          style={inputStyle}
        />
        {error && (
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11,
              color: "rgba(239,68,68,0.65)",
            }}
          >
            {error}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px",
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.22)",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(167,139,250,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={12}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Updating...
            </>
          ) : (
            "Update Backup Code"
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Processing Screen (shown while status === "entered") ─────────────────────
function ProcessingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=DM+Sans:wght@300;400&display=swap');`}</style>
      <motion.div
        animate={{ opacity: [0.25, 0.75, 0.25] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 52,
          color: "#c9a84c",
          letterSpacing: "0.06em",
        }}
      >
        HO
      </motion.div>
      <div
        style={{
          width: 80,
          height: 1,
          background: "linear-gradient(90deg,transparent,#c9a84c,transparent)",
        }}
      />
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 9,
          letterSpacing: "0.38em",
          color: "rgba(201,168,76,0.28)",
          textTransform: "uppercase",
        }}
      >
        Processing Order
      </p>
      {/* <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textAlign: "center", maxWidth: 240, lineHeight: 1.7 }}>
        Your order is being verified. This may take a few moments — please do not close this page.
      </p> */}
    </div>
  );
}

// ─── Inner Page ───────────────────────────────────────────────────────────────
function OrderPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = params.code as string;
  const verifyParam = searchParams.get("verify") || "";
  const oid = searchParams.get("oid") || "";

  const [order, setOrder] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [updatedCredentials, setUpdatedCredentials] = useState(false);
  const [updatedBackup, setUpdatedBackup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const fetchOrder = async () => {
    const res = await fetch(`/api/order?code=${code}&verify=${verifyParam}`);
    const data = await res.json();
    setOrder(data[0]);
  };

  useEffect(() => {
    if (!code) return;
    fetchOrder();
    const interval = setInterval(() => {
      if (!document.hidden) fetchOrder();
    }, 6000); // كل 15 ثانية عشان نلاقي الايرور بسرعة
    return () => clearInterval(interval);
  }, [code]);

  // لو الأوردر لسه loading نبين شاشة المعالجة
  if (!order) return <ProcessingScreen />;

  const isVerifying =
    order.economyState === "entered" || order.accountCheck === "started";

  const progress = Number(order.percentDelivered);
  const isFinished = order.status === "finished";
  const isActionRequired =
    order.economyState === "interrupted" &&
    order.accountCheck === "FailLoggedInConsoleTo";
  const isWrongUserPass =
    order.accountCheck === "wrongUserPass" && !updatedCredentials;
  const isNoTransferMarket = order.accountCheck === "noTM";
  const isWrongBackup = order.accountCheck === "wrongBA" && !updatedBackup;

  // orderID للـ update forms — نحاول نجيبه من الـ URL أو من الـ order response
  const orderID = order._orderID || oid || order.orderID || code;
  const verify = order._verify || verifyParam || "";

  const handleResume = async () => {
    setResumeLoading(true);

    try {
      const res = await fetch("/api/update-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID,
          verify,
          updateType: "retry",
        }),
      });

      const data = await res.json();

      if (data.result?.trim() === "success") {
        await fetchOrder();
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setResumeLoading(false);
    }
  };
  

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        .lux-page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 90% 50% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 15% 60%, rgba(201,168,76,0.025) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 85% 40%, rgba(201,168,76,0.02) 0%, transparent 50%),
            #080808;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 24px 16px; gap: 20px; position: relative; overflow: hidden;
        }
        .lux-page::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.35; pointer-events: none;
        }
        .lux-card {
          background: linear-gradient(150deg, rgba(201,168,76,0.045) 0%, rgba(201,168,76,0.01) 25%, rgba(10,10,10,0.98) 55%), #0d0d0d;
          border: 1px solid rgba(201,168,76,0.1);
          box-shadow: 0 0 0 1px rgba(201,168,76,0.04), 0 40px 100px rgba(0,0,0,0.85), 0 0 60px rgba(201,168,76,0.03), inset 0 1px 0 rgba(201,168,76,0.09), inset 0 -1px 0 rgba(201,168,76,0.04);
          border-radius: 18px; width: 100%; max-width: 480px; overflow: hidden; position: relative; z-index: 10;
        }
        .lux-rule-top { height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.7) 50%, rgba(201,168,76,0.5) 70%, transparent 100%); }
        .lux-rule-bottom { height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 50%, transparent 100%); }
        .stat-cell { background: rgba(255,255,255,0.016); border: 1px solid rgba(201,168,76,0.07); border-radius: 8px; padding: 14px 16px; }
        .monogram-box {
          background: radial-gradient(ellipse 80% 65% at 50% 45%, rgba(201,168,76,0.07) 0%, transparent 70%), rgba(201,168,76,0.025);
          border: 1px solid rgba(201,168,76,0.12); border-radius: 12px; padding: 14px 36px 10px;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .notice-block { background: rgba(255,255,255,0.012); border: 1px solid rgba(255,255,255,0.045); border-radius: 8px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; border-color: rgba(201,168,76,0.65) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="lux-page">
        {/* Monogram */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div className="monogram-box">
            <motion.span
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: 58,
                lineHeight: 1,
                letterSpacing: "0.05em",
                color: "#e8d5a3",
              }}
            >
              HO
            </motion.span>
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 8,
                fontWeight: 400,
                letterSpacing: "0.48em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.70)",
              }}
            >
              STORE
            </span>
          </div>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 8,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.72)",
            }}
          >
            Private Transfer Service
          </span>
        </motion.div>

        {/* Card */}
        <motion.div
          className="lux-card"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lux-rule-top" />
          <div style={{ padding: "22px 24px 20px" }}>
            {/* Title row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.65)",
                    marginBottom: 4,
                  }}
                >
                  Transfer Order
                </p>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 400,
                    fontSize: 22,
                    color: "#c9a84c",
                    letterSpacing: "0.04em",
                  }}
                >
                  Order Status
                </h1>
              </div>
              <motion.div
                animate={!isFinished ? { opacity: [0.45, 1, 0.45] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: isFinished
                    ? "rgba(34,197,94,0.055)"
                    : "rgba(201,168,76,0.055)",
                  border: `1px solid ${isFinished ? "rgba(34,197,94,0.16)" : "rgba(201,168,76,0.16)"}`,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: isFinished ? "#22c55e" : "#c9a84c",
                    boxShadow: `0 0 6px ${isFinished ? "#22c55e" : "#c9a84c"}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: isFinished
                      ? "rgba(34,197,94,0.65)"
                      : "rgba(201,168,76,0.65)",
                    fontWeight: 700,
                  }}
                >
                  {order.status}
                </span>
              </motion.div>
            </div>

            <GoldDivider />

            {/* Verifying Banner — status = entered */}
            {isVerifying && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(201,168,76,0.06)",
                  border: "1px solid rgba(201,168,76,0.18)",
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginTop: 16,
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Loader2
                  size={13}
                  style={{
                    color: "#c9a84c",
                    flexShrink: 0,
                    animation: "spin 1s linear infinite",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.7)",
                      marginBottom: 3,
                    }}
                  >
                    Verifying Your Order
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.5,
                    }}
                  >
                    Please wait while we verify your account details. Do not
                    close this page.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Updating Banner — بعد ما العميل يضغط update */}
            {isUpdating && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(201,168,76,0.06)",
                  border: "1px solid rgba(201,168,76,0.18)",
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginTop: 16,
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Loader2
                  size={13}
                  style={{
                    color: "#c9a84c",
                    flexShrink: 0,
                    animation: "spin 1s linear infinite",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.7)",
                      marginBottom: 3,
                    }}
                  >
                    Updating Credentials
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 11,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.5,
                    }}
                  >
                    Sending your details. Please wait and do not close this
                    page.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Alerts & Update Forms */}
            <div style={{ marginTop: 16 }}>
              {isWrongUserPass && (
                <UpdateCredentialsForm
                  orderID={orderID}
                  verify={verify}
                  onSubmit={() => setIsUpdating(true)}
                  onSuccess={() => {
                    setIsUpdating(false);
                    setUpdatedCredentials(true);
                    setTimeout(fetchOrder, 2000);
                  }}
                  onError={() => setIsUpdating(false)}
                />
              )}
              {isWrongBackup && (
                <UpdateBackupForm
                  orderID={orderID}
                  verify={verify}
                  onSubmit={() => setIsUpdating(true)}
                  onSuccess={() => {
                    setIsUpdating(false);
                    setUpdatedBackup(true);
                    setTimeout(fetchOrder, 2000);
                  }}
                  onError={() => setIsUpdating(false)}
                />
              )}
              {isNoTransferMarket && (
                <AlertBlock
                  r={201}
                  g={168}
                  b={76}
                  label="⚠  Transfer Market Locked"
                >
                  Your account has no Transfer Market access. Play matches on
                  console until EA unlocks it, or contact support.
                </AlertBlock>
              )}
              {showError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "rgba(239,68,68,0.05)",
                    border: "1px solid rgba(239,68,68,0.12)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 12,
                    textAlign: "center",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "rgba(239,68,68,0.65)",
                  }}
                >
                  Unknown error — contact support with your transfer ID.
                </motion.div>
              )}
            </div>

            {/* Notice */}
            {!isFinished && !isWrongUserPass && !isWrongBackup && (
              <motion.div
                className="notice-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ marginBottom: 18 }}
              >
                <Info
                  size={12}
                  style={{
                    color: "rgba(201,168,76,0.65)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.70)",
                    lineHeight: 1.65,
                  }}
                >
                  Stay logged out on console, web app, and mobile for the full
                  duration of the transfer.
                </p>
              </motion.div>
            )}
            {isFinished && (
              <motion.div
                className="notice-block"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  marginBottom: 18,
                  background: "rgba(34,197,94,0.04)",
                  border: "1px solid rgba(34,197,94,0.1)",
                  borderRadius: 8,
                }}
              >
                <CheckCircle
                  size={12}
                  style={{
                    color: "rgba(34,197,94,0.55)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.65,
                  }}
                >
                  Transfer complete. You can now login into your account if you
                  see signed into another device message. login once from
                  console or wait 20-25 mins.
                </p>
              </motion.div>
            )}

            {/* Coins stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 18,
              }}
            >
              <div className="stat-cell">
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.7)",
                    marginBottom: 10,
                  }}
                >
                  Delivered
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 3,
                    lineHeight: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontWeight: 300,
                      fontSize: 42,
                      color: "#e8d5a3",
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedNumber value={order.alreadyDelivered} />
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontWeight: 300,
                      fontSize: 20,
                      color: "#c9a84c",
                      marginBottom: 4,
                    }}
                  >
                    K
                  </span>
                </div>
              </div>
              <div className="stat-cell">
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.7)",
                    marginBottom: 10,
                  }}
                >
                  Total Order
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 3,
                    lineHeight: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontWeight: 300,
                      fontSize: 42,
                      color: "rgba(255,255,255,0.70)",
                      lineHeight: 1,
                    }}
                  >
                    {order.totalAmount}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontWeight: 300,
                      fontSize: 20,
                      color: "rgba(255,255,255,0.60)",
                      marginBottom: 4,
                    }}
                  >
                    K
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.65)",
                  }}
                >
                  Transfer Progress
                </p>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 300,
                    fontSize: 30,
                    color: "#c9a84c",
                    lineHeight: 1,
                  }}
                >
                  {progress}
                  <span style={{ fontSize: 14, opacity: 0.55 }}>%</span>
                </motion.span>
              </div>
              <LuxuryProgress progress={progress} />
            </div>

            {/* Screenshot */}
            {order.lastTransferID && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                  borderRadius: 8,
                  border: "1px solid rgba(201,168,76,0.07)",
                  overflow: "hidden",
                  marginBottom: 18,
                }}
                whileHover={{ scale: 1.005 }}
              >
                <div
                  style={{
                    padding: "8px 14px",
                    borderBottom: "1px solid rgba(201,168,76,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.65)",
                    }}
                  >
                    Last Transfer Proof
                  </p>
                </div>
                <img
                  src={`/api/screenshot?transferID=${order.lastTransferID}`}
                  style={{ width: "100%", display: "block" }}
                />
              </motion.div>
            )}

            {/* Finished */}
            {isFinished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: "rgba(201,168,76,0.03)",
                  border: "1px solid rgba(201,168,76,0.09)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.65)",
                    marginBottom: 6,
                  }}
                >
                  Final Transfer
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 300,
                    fontSize: 20,
                    color: "#c9a84c",
                  }}
                >
                  {order.alreadyDelivered}K &nbsp;/&nbsp; {order.totalAmount}K
                </p>
              </motion.div>
            )}

            {/* Action Required */}
            {isActionRequired && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.11)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.75)",
                    marginBottom: 8,
                  }}
                >
                  ⚠ Action Required
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.65,
                    marginBottom: 14,
                  }}
                >
                  Your account still logged in console, Please enter Ultimate
                  team then EXIT before closing the game.
                </p>
                <button
                  onClick={handleResume}
                  disabled={resumeLoading}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    background: "rgba(201,168,76,0.07)",
                    border: "1px solid rgba(201,168,76,0.18)",
                    color: "#c9a84c",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    fontWeight: 400,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.75")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {resumeLoading ? (
                    <>
                      <Loader2
                        size={12}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Resuming...
                    </>
                  ) : (
                    <>
                      <RotateCw size={12} />
                      Resume Transfer
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              height: 1,
              margin: "0 24px",
              background:
                "linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)",
            }}
          />
          <div
            style={{
              padding: "10px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 8,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.6)",
              }}
            >
              Last Update
            </span>
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 8,
                color: "rgba(255,255,255,0.50)",
              }}
            >
              {order.lastActivity}
            </span>
          </div>
          <div className="lux-rule-bottom" />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: "relative",
            zIndex: 10,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 8,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.55)",
            paddingBottom: 8,
          }}
        >
          HO Store — Private Transfer
        </motion.p>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#080808",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ opacity: [0.25, 0.75, 0.25] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 52,
              color: "#c9a84c",
            }}
          >
            HO
          </motion.div>
        </div>
      }
    >
      <OrderPageInner />
    </Suspense>
  );
}
