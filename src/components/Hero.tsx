"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";

// Dynamically import the wallet button to prevent hydration errors
const ClientWalletButton = dynamic(
  () => import('./ClientWalletButton'),
  { ssr: false }
);
import { ArrowRight, ChevronRight } from "lucide-react";

export default function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-[94vh] flex flex-col justify-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center"
        >
          <motion.span
            className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-black text-white mb-4"
    
          >
           BUIDL - Memecoin Website Generator
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-8xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[18.7rem] font-black text-black select-none leading-normal xl:-mb-10"
          >
            BUIDL
          </motion.h1>

          <div className="mt-8">
            <motion.h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              No Code. No Stress. Just Moon Vibes
            </motion.h1>

            <motion.p
              className="mt-6 text-sm sm:text-base md:text-lg  text-gray-600 max-w-5xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Skip the boring stuff. Pick a crazy template, slap your coin’s
              name on it, and start mooning. 
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {isSignedIn ? (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold overflow-hidden rounded-full bg-black text-white transition-all duration-300 hover:bg-black"
                  >
                    <span className="relative flex items-center gap-2">
                      Go to Dashboard
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </span>
                  </motion.button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold overflow-hidden rounded-full bg-black text-white transition-all duration-300 hover:bg-black"
                  >
                    <span className="relative flex items-center gap-2">
                      Get Started
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </span>
                  </motion.button>
                </Link>
              )}
              <Link href="#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-bold rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 text-black"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="hidden md:block text-sm text-black mb-2">Scroll to explore</span>
          <ChevronRight className="w-6 h-6 text-black transform rotate-90" />
        </motion.div>
      </motion.div>
    </div>
  );
}
