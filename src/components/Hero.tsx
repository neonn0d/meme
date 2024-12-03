'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignUpButton, useUser } from "@clerk/nextjs";
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function Hero() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-[94vh] flex flex-col justify-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center"
        >
          <motion.span 
            className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-black text-white mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Memecoin Website Builder
          </motion.span>
          
          <motion.h1 
            className="text-6xl sm:text-7xl font-bold text-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Create Your Memecoin Website
            <br />
            <span className="text-4xl sm:text-5xl">in Minutes</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl text-black max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Launch your memecoin with a professional website. Choose from stunning templates,
            customize with ease, and go live instantly.
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
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold overflow-hidden rounded-full bg-black text-white transition-all duration-300 hover:bg-black"
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
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold overflow-hidden rounded-full bg-black text-white transition-all duration-300 hover:bg-black"
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
              </SignUpButton>
            )}
            <Link href="#features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-3 text-lg font-bold rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 text-black"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
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
          <span className="text-sm text-black mb-2">Scroll to explore</span>
          <ChevronRight className="w-6 h-6 text-black transform rotate-90" />
        </motion.div>
      </motion.div>
    </div>
  );
}
