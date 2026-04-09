"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, animate, useMotionValue, useSpring } from "framer-motion";
import { CheckCircle, Info, RotateCw, AlertTriangle, Coins } from "lucide-react";

// ─── Animated Number Counter ──────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Number(v.toFixed(decimals))),
    });
    return controls.stop;
  }, [value]);
  return <>{display}</>;
}

// ─── Spinning Coin ────────────────────────────────────────────────────────────
function SpinningCoin({ size = 32, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.div
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay }}
      style={{ width: size, height: size, transformStyle: "preserve-3d" }}
      className="flex items-center justify-center"
    >
      <img src="/coin.png" style={{ width: size, height: size }} className="object-contain" />
    </motion.div>
  );
}

// ─── FUT-style Progress Bars ──────────────────────────────────────────────────
function FUTProgressBars({ progress }: { progress: number }) {
  const bars = 10;
  const filled = Math.round((progress / 100) * bars);

  return (
    <div className="flex gap-1 items-center w-full">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.05 * i + 0.3, duration: 0.4, ease: "easeOut" }}
          className="flex-1 rounded-sm origin-bottom"
          style={{
            height: i < filled ? `${14 + (i % 3) * 4}px` : "10px",
            background:
              i < filled
                ? i < filled * 0.5
                  ? "linear-gradient(180deg, #86efac, #22c55e)"
                  : i < filled * 0.85
                  ? "linear-gradient(180deg, #fde68a, #f59e0b)"
                  : "linear-gradient(180deg, #fca5a5, #ef4444)"
                : "rgba(255,255,255,0.07)",
            boxShadow:
              i < filled
                ? i < filled * 0.5
                  ? "0 0 6px rgba(34,197,94,0.6)"
                  : i < filled * 0.85
                  ? "0 0 6px rgba(245,158,11,0.6)"
                  : "0 0 6px rgba(239,68,68,0.6)"
                : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Floating Particle ────────────────────────────────────────────────────────
function FloatingParticle({ index }: { index: number }) {
  const left = useRef(Math.random() * 100).current;
  const delay = useRef(Math.random() * 8).current;
  const duration = useRef(12 + Math.random() * 10).current;
  const size = useRef(6 + Math.random() * 10).current;
  const drift = useRef((Math.random() - 0.5) * 60).current;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${left}%`, bottom: -20 }}
      animate={{
        y: [0, -(typeof window !== "undefined" ? window.innerHeight + 60 : 900)],
        x: [0, drift],
        opacity: [0, 0.7, 0.7, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <img src="/coin.png" style={{ width: size, height: size }} className="object-contain" />
    </motion.div>
  );
}

// ─── Star particle ────────────────────────────────────────────────────────────
function StarParticle({ index }: { index: number }) {
  const left = useRef(Math.random() * 100).current;
  const top = useRef(Math.random() * 100).current;
  const delay = useRef(Math.random() * 4).current;
  const size = useRef(1 + Math.random() * 2).current;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        background: `rgba(${Math.random() > 0.5 ? "253,211,77" : "255,255,255"},0.6)`,
      }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2 + Math.random() * 2, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Alert Banner ─────────────────────────────────────────────────────────────
function AlertBanner({
  color,
  icon,
  title,
  children,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const colors: Record<string, { bg: string; border: string; title: string }> = {
    red: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", title: "#f87171" },
    yellow: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", title: "#fbbf24" },
    purple: { bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)", title: "#c084fc" },
  };
  const c = colors[color];
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl p-4 mb-4"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-center gap-2 mb-1.5" style={{ color: c.title }}>
        {icon}
        <span className="text-xs font-bold tracking-widest uppercase">{title}</span>
      </div>
      <div className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrderPage() {
  const params = useParams();
  const code = params.code as string;
  const [showError, setShowError] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const fetchOrder = async () => {
    const res = await fetch(`/api/order?code=${code}`);
    const data = await res.json();
    setOrder(data[0]);
  };

  useEffect(() => {
    if (!code) return;
    fetchOrder();
    if (order?.status === "finished") return;
    const interval = setInterval(() => {
      if (!document.hidden) fetchOrder();
    }, 60000);
    return () => clearInterval(interval);
  }, [code, order?.status]);

  // Loading screen
  if (!order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8"
        style={{ background: "linear-gradient(160deg, #0a0e1a 0%, #0f1420 50%, #0a0c14 100%)" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');`}</style>
        {/* FUT loading bar */}
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img src="/coin.png" className="w-16 h-16 object-contain" />
          </motion.div>
          <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #f59e0b, #fde68a)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.3em", color: "#f59e0b", fontSize: 11 }}>
            LOADING ORDER...
          </p>
        </div>
      </div>
    );

  const progress = Number(order.percentDelivered);
  const isFinished = order.status === "finished";
  const isActionRequired =
    order.economyState === "interrupted" && order.accountCheck === "FailLoggedInConsoleTo";
  const isWrongUserPass = order.accountCheck === "wrongUserPass";
  const isNoTransferMarket = order.accountCheck === "noTM";
  const isWrongBackup = order.accountCheck === "wrongBA";

  const particles = Array.from({ length: 18 });
  const stars = Array.from({ length: 30 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fut-bg {
          background:
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 10% 50%, rgba(16,36,80,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 90% 50%, rgba(16,36,80,0.5) 0%, transparent 60%),
            linear-gradient(160deg, #080c18 0%, #0d1225 40%, #08101e 100%);
        }

        .card-shell {
          background: linear-gradient(145deg,
            rgba(253,211,77,0.12) 0%,
            rgba(253,211,77,0.04) 20%,
            rgba(15,22,45,0.95) 40%,
            rgba(10,15,32,0.98) 100%
          );
          border: 1px solid rgba(253,211,77,0.18);
          box-shadow:
            0 0 0 1px rgba(253,211,77,0.06),
            0 24px 80px rgba(0,0,0,0.8),
            0 0 60px rgba(245,158,11,0.05),
            inset 0 1px 0 rgba(253,211,77,0.12);
        }

        .card-inner {
          background: linear-gradient(180deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,255,255,0.01) 100%
          );
          border: 1px solid rgba(255,255,255,0.05);
        }

        .gold-text {
          background: linear-gradient(135deg, #fde68a 0%, #f59e0b 40%, #d97706 70%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fut-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 10px;
          color: rgba(253,211,77,0.4);
        }

        .fut-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(253,211,77,0.15), transparent);
        }

        .stripe-accent {
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a, #fbbf24, #f59e0b);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .glow-pulse {
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.15); }
          50% { box-shadow: 0 0 40px rgba(245,158,11,0.3), 0 0 80px rgba(245,158,11,0.1); }
        }

        .diamond {
          width: 6px; height: 6px;
          background: #f59e0b;
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* Clip path for FUT card shape — slightly angled top-right corner */
        .fut-card-clip {
          clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
        }

        /* Corner fold indicator */
        .corner-fold::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 24px; height: 24px;
          background: linear-gradient(225deg, rgba(253,211,77,0.25) 0%, transparent 60%);
          clip-path: polygon(100% 0, 100% 100%, 0 0);
        }
      `}</style>

      <div className="fut-bg min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 gap-5">

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((_, i) => <StarParticle key={i} index={i} />)}
        </div>

        {/* Floating coins */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((_, i) => <FloatingParticle key={i} index={i} />)}
        </div>

        {/* Top gold shimmer line */}
        <div className="fixed top-0 left-0 right-0 h-[2px] stripe-accent z-50" />

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] z-10"
        >
          <div className="flex items-center justify-between px-1">
            {/* Typographic Wordmark */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative flex flex-col leading-none select-none"
            >
              {/* Top line: HO + star */}
              <div className="flex items-center gap-2">
                <span
                  className="gold-text"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: 42,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    filter: "drop-shadow(0 0 18px rgba(245,158,11,0.45))",
                  }}
                >
                  HO
                </span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    color: "#f59e0b",
                    fontSize: 18,
                    lineHeight: 1,
                    marginBottom: 2,
                    filter: "drop-shadow(0 0 8px rgba(245,158,11,0.8))",
                  }}
                >
                  ★
                </motion.span>
              </div>
              {/* Bottom line: STORE */}
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: "0.32em",
                  color: "rgba(253,211,77,0.45)",
                  textTransform: "uppercase",
                  marginTop: -2,
                  paddingLeft: 2,
                }}
              >
                STORE
              </span>
            </motion.div>

            {/* Status pill */}
            <motion.div
              animate={!isFinished ? { opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: isFinished ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                border: `1px solid ${isFinished ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: isFinished ? "#22c55e" : "#f59e0b",
                  boxShadow: `0 0 6px ${isFinished ? "#22c55e" : "#f59e0b"}`,
                }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", color: isFinished ? "#22c55e" : "#f59e0b" }}
              >
                {isFinished ? "Completed" : "Live"}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ── MAIN FUT CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] rounded-2xl overflow-hidden card-shell glow-pulse fut-card-clip corner-fold relative z-10"
        >
          {/* Gold accent bar */}
          <div className="stripe-accent h-[2px] w-full" />

          {/* Card header area */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="fut-label mb-1">HO Store</div>
                <h1 className="gold-text text-3xl font-black leading-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-0.01em" }}>
                  ORDER STATUS
                </h1>
              </div>
              <SpinningCoin size={40} />
            </div>
          </div>

          <div className="divider mx-5" />

          <div className="px-5 py-4 space-y-4">

            {/* ── ALERTS ── */}
            {isWrongUserPass && (
              <AlertBanner color="red" icon={<AlertTriangle size={13} />} title="Wrong Credentials">
                Your EA email or password is incorrect. Please verify your credentials to continue the transfer.
              </AlertBanner>
            )}
            {isNoTransferMarket && (
              <AlertBanner color="yellow" icon={<AlertTriangle size={13} />} title="Transfer Market Locked">
                Your account has no Transfer Market access. Play matches on console until EA unlocks it, or contact support.
              </AlertBanner>
            )}
            {isWrongBackup && (
              <AlertBanner color="purple" icon={<AlertTriangle size={13} />} title="Backup Code Required">
                One or more backup codes are invalid.{" "}
                <a href="https://myaccount.ea.com/cp-ui/security/index" target="_blank"
                  className="underline underline-offset-2" style={{ color: "#c084fc" }}>
                  EA Security Settings →
                </a>
              </AlertBanner>
            )}
            {showError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl p-3 text-center text-xs"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "'Barlow', sans-serif" }}
              >
                Unknown error — contact support with your transfer ID.
              </motion.div>
            )}

            {/* ── INFO / DONE BANNER ── */}
            {!isFinished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl p-3 flex gap-3 items-start"
                style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Transfer In Progress</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    Stay logged out on console, web app, and mobile during the entire transfer.
                  </p>
                </div>
              </motion.div>
            )}

            {isFinished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl p-3 flex gap-3 items-start"
                style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <CheckCircle size={13} className="text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Transfer Complete!</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    30 min cooldown before using the web app. You can also login on console and log out.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── COINS BIG DISPLAY ── */}
            <div className="card-inner rounded-2xl p-4">
              {/* FUT-card style stat row */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {/* Delivered */}
                <div className="text-center">
                  <div className="fut-label mb-1">Delivered</div>
                  <div className="gold-text text-3xl leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}>
                    <AnimatedNumber value={order.alreadyDelivered} />
                    <span className="text-lg">K</span>
                  </div>
                </div>

                {/* Divider + coin */}
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <SpinningCoin size={28} delay={0.5} />
                  <div className="fut-label text-center" style={{ fontSize: 9 }}>COINS</div>
                </div>

                {/* Total */}
                <div className="text-center">
                  <div className="fut-label mb-1">Total</div>
                  <div className="text-3xl leading-none text-white/80 font-black"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {order.totalAmount}<span className="text-lg">K</span>
                  </div>
                </div>
              </div>

              {/* FUT progress bars */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="fut-label">Transfer Progress</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="gold-text text-xl font-black"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {progress}%
                  </motion.span>
                </div>
                <FUTProgressBars progress={progress} />
              </div>

              {/* Rating circle (FUT style) */}
              <div className="flex justify-center mt-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
                  className="relative flex items-center justify-center"
                  style={{
                    width: 72, height: 72,
                    background: "linear-gradient(145deg, rgba(253,211,77,0.12), rgba(253,211,77,0.03))",
                    border: "2px solid rgba(253,211,77,0.25)",
                    borderRadius: "50%",
                    boxShadow: "0 0 24px rgba(245,158,11,0.15)",
                  }}
                >
                  <div className="text-center">
                    <div className="gold-text text-2xl font-black leading-none"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {progress}
                    </div>
                    <div className="fut-label" style={{ fontSize: 8 }}>PCT</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ── SCREENSHOT ── */}
            {order.lastTransferID && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(253,211,77,0.1)" }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="px-3 py-2 border-b" style={{ borderColor: "rgba(253,211,77,0.08)" }}>
                  <span className="fut-label">Last Transfer Proof</span>
                </div>
                <img
                  src={`https://futtransfer.top/getScreenshot.php?transferID=${order.lastTransferID}&mode=2`}
                  className="w-full"
                />
              </motion.div>
            )}

            {/* ── ACTION REQUIRED ── */}
            {isActionRequired && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-4"
                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={13} className="text-yellow-500" />
                  <span className="fut-label text-yellow-500">Action Required</span>
                </div>
                <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  You are logged in on the EA webapp. Please log out to resume.
                </p>
                <button
                  onClick={() => {
                    setShowError(true);
                    setTimeout(() => setShowError(false), 3000);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08))",
                    border: "1px solid rgba(245,158,11,0.3)",
                    color: "#fbbf24",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: "0.12em",
                  }}
                >
                  <RotateCw size={14} />
                  Resume Transfer
                </button>
              </motion.div>
            )}

            {/* ── FINISHED STATUS ── */}
            {isFinished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}
              >
                <div className="fut-label text-green-700 mb-1">Final Score</div>
                <div className="text-green-400 text-xl font-black"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {order.alreadyDelivered}K / {order.totalAmount}K — {progress}%
                </div>
              </motion.div>
            )}

          </div>

          {/* ── BOTTOM STATUS BAR ── */}
          <div className="divider mx-5" />
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={!isFinished ? { opacity: [0.3, 1, 0.3] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{
                  background: isFinished ? "#22c55e" : "#f59e0b",
                  boxShadow: `0 0 6px ${isFinished ? "#22c55e" : "#f59e0b"}`,
                }}
              />
              <span className="text-xs font-bold uppercase tracking-widest capitalize"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", color: isFinished ? "#22c55e" : "#f59e0b" }}>
                {order.status}
              </span>
            </div>
            <span className="fut-label" style={{ fontSize: 9 }}>{order.lastActivity}</span>
          </div>

          {/* Bottom gold line */}
          <div className="stripe-accent h-[2px] w-full" />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="fut-label pb-2 z-10"
          style={{ fontSize: 9 }}
        >
          HO STORE — FUT TRANSFER SYSTEM
        </motion.p>
      </div>
    </>
  );
}