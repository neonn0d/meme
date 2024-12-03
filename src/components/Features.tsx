'use client';

import { motion } from 'framer-motion';
import { Rocket, Zap, Palette } from 'lucide-react';

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

export default function Features() {
  return (
    <div className="bg-zinc-100">
      <motion.div 
        id="features" 
        className="py-24 relative max-w-7xl mx-auto px-4 md:px-0"
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
  );
}
