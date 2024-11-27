'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Zap, Palette, ChevronRight, ArrowRight } from 'lucide-react';
import { SignUpButton, useUser } from "@clerk/nextjs";

const features = [
  {
    name: 'Professional Templates',
    description: 'Choose from our collection of modern, responsive designs crafted specifically for memecoins. Each template is optimized for conversion and engagement.',
    icon: <Rocket className="h-7 w-7" aria-hidden="true" />,
  },
  {
    name: 'Easy Customization',
    description: 'Personalize your website with our intuitive editor. Change colors, content, and layout with just a few clicks - no coding required.',
    icon: <Palette className="h-7 w-7" aria-hidden="true" />,
  },
  {
    name: 'Instant Preview',
    description: 'Preview your website changes in real-time as you make them. Perfect your design before sharing it with your community.',
    icon: <Zap className="h-7 w-7" aria-hidden="true" />,
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
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

        {/* Features Section */}
        <div className="bg-white">
          <motion.div 
            id="features" 
            className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="text-center mb-20">
              <motion.span
                className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-black text-white mb-4"
                variants={item}
              >
                Features
              </motion.span>
              <motion.h2 
                className="text-4xl font-bold mb-6 text-black"
                variants={item}
              >
                Everything You Need
              </motion.h2>
              <motion.p 
                className="text-xl text-black max-w-2xl mx-auto"
                variants={item}
              >
                Launch your memecoin website with powerful features
              </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 relative max-w-5xl mx-auto">
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  variants={item}
                  className="relative group"
                >
                  <div className="h-full relative p-8 rounded-2xl bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-300">
                    <div className="inline-flex p-3 rounded-xl bg-black group-hover:bg-white mb-6 text-white group-hover:text-black transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.name}</h3>
                    <p className="leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="py-24 text-center relative bg-black text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Launch Your Memecoin Website?
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
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
      </main>
    </div>
  );
}
