"use client";
import { motion } from 'framer-motion';
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4 sm:p-6 gap-6">
      <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
              <img
                  src="/logoIcon.png"
                  className="w-100 h-100 object-contain bg-gray-900/15 p-1 rounded-lg mx-auto mt-[-8px]"
                  />
                  </motion.div>
      <h1 className="text-3xl font-extrabold leading-tight bg-transparent text-transparent
       bg-clip-text bg-gradient-to-r from-blue-800/90 to-green-300 animate-pulse ">H O Store Progress Tracker</h1>
    </main>
  );
}