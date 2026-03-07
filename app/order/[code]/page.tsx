"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Info, Coins } from "lucide-react";

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
    const interval = setInterval(fetchOrder, 4000);

    return () => clearInterval(interval);
  }, [code]);

  if (!order)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading order...
      </div>
    );

  const progress = Number(order.percentDelivered);
  const isFinished = order.status === "finished";

  const isActionRequired =
    order.economyState === "interrupted" &&
    order.accountCheck === "FailLoggedInConsoleTo";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-[480px] rounded-2xl shadow-2xl p-8"
      >
        {/* TITLE */}

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Order Status</h1>

        {/* ERROR */}

        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm text-center"
          >
            An unknown error occurred. Please contact the support team with the
            transfer ID.
          </motion.div>
        )}

        {/* ORDER INFO MESSAGE */}

        {!isFinished && (
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 font-semibold text-blue-700 mb-2">
              <Info size={18} />
              Order Status Information
            </div>

            <p className="text-sm text-gray-600">
              Thank you for your order. The current status is displayed below.
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Keep in mind to stay logged out during the transfer from console,
              web and mobile app, otherwise the process will be interrupted.
            </p>
          </div>
        )}

        {/* COMPLETED MESSAGE */}

        {isFinished && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50/50 border border-green-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-2 font-semibold text-green-700 mb-2">
              <CheckCircle size={18} />
              Order Completed!
            </div>

            <p className="text-sm text-gray-600">
              The order is finished. Please keep in mind that there is a
              cooldown of 30 minutes before you can use the web app again.
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Alternatively you can login on console and log out again. Thank
              you for using our system.
            </p>
          </motion.div>
        )}

        {/* SCREENSHOT */}

        {order.lastTransferID && (
          <div className="mt-6">
            {/* <div className="text-sm text-gray-500 mb-2 text-center">
              Last Transfer Screenshot
            </div> */}

            <img
              src={`https://futtransfer.top/getScreenshot.php?transferID=${order.lastTransferID}&mode=2`}
              className="rounded-lg border"
            />
          </div>
        )}

        {/* COINS INFO */}

        <div className="text-center mb-6 mt-4">
          <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
            <Coins size={16} />
            Coins Delivered
          </div>

          <div className="text-4xl font-bold mt-2 text-gray-900">
            {order.alreadyDelivered}K
          </div>

          <div className="text-gray-500">/ {order.totalAmount}K</div>
        </div>

        {/* PROGRESS BAR */}

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-green-700"
            />
          </div>
        </div>

        {/* FINAL GREEN MESSAGE */}

        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 text-green-800 rounded-xl p-4 text-center mb-6"
          >
            <div className="font-semibold mb-1">Current Status:</div>

            <div className="text-md font-bold">
              {order.alreadyDelivered}K / {order.totalAmount}K coins
              successfully transferred ({progress}%)
            </div>
          </motion.div>
        )}

        {isActionRequired && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-yellow-50/50 border border-yellow-200/50 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-2 font-semibold text-yellow-900 mb-2">
              ⚠️ Action Required
            </div>

            <p className="text-sm text-gray-700">
              You are logged in on the EA webapp. Please log out and try again.
            </p>

            <button
              onClick={() => {
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
              }}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2"
            >
              🔄 Resume Transfer
            </button>
          </motion.div>
        )}

        {/* STATUS BADGE */}

        {!showError && (
          <div className="text-center mt-2 animate-pulse">
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              {order.status}
            </span>
          </div>
        )}

        {/* LAST ACTIVITY */}

        <div className="text-center text-xs text-gray-400 mt-6">
          Last update: {order.lastActivity}
        </div>
      </motion.div>
    </div>
  );
}
