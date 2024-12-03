'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';
import { SignUpButton, useUser } from "@clerk/nextjs";

export default function CTA() {
  const { isSignedIn } = useUser();
  const { scrollYProgress } = useScroll();
  
  const rocketX = useTransform(scrollYProgress, [0.7, 1], ['-50%', '0%']);

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Background Rocket */}
      <motion.div 
        className="absolute md:right-24 right-0 top-0 -translate-y-1/2 transform opacity-5"
        style={{ 
          x: rocketX
        }}
      >
        <Rocket className="h-96 w-96 rotate-45 text-white" />
      </motion.div>
      
      <motion.div 
        className="py-24 text-center relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Launch Your Memecoin Website?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300">
            Join the growing community of successful memecoin projects.
          </p>
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSignedIn ? (
              <Link href="/dashboard">
                <button className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold overflow-hidden rounded-full bg-white text-black transition-all duration-300 hover:bg-black hover:text-white border-2 border-white">
                  <span className="relative flex items-center gap-2">
                    Go to Dashboard
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </button>
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <button className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold overflow-hidden rounded-full bg-white text-black transition-all duration-300 hover:bg-black hover:text-white border-2 border-white">
                  <span className="relative flex items-center gap-2">
                    Start Building Now
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </button>
              </SignUpButton>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
