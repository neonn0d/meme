'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare, Zap, Users, Clock } from 'lucide-react';
import { useUser } from "@clerk/nextjs";

const features = [
  {
    name: 'Mass Messaging',
    description: 'Send your marketing message to multiple Telegram groups with just a few clicks. Perfect for announcing launches and updates.',
    icon: <MessageSquare className="h-7 w-7" aria-hidden="true" />,
  },
  {
    name: 'Smart Rate Limiting',
    description: 'Customize message delay between 500ms and 3000ms to prevent Telegram rate limiting and ensure all your messages are delivered.',
    icon: <Clock className="h-7 w-7" aria-hidden="true" />,
  },
  {
    name: 'Audience Targeting',
    description: 'Manage multiple Telegram sessions and target specific groups for your marketing campaigns.',
    icon: <Users className="h-7 w-7" aria-hidden="true" />,
  },
  {
    name: 'Premium Access',
    description: 'Free users can send up to 3 messages. Upgrade to premium for unlimited messaging capabilities.',
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

export default function TelegramMarketing() {
  const { isSignedIn } = useUser();

  return (
    <div className="bg-white">
      <motion.div 
        id="telegram-marketing" 
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
            NEW
          </motion.span>
          <motion.h2 
            className="text-4xl font-bold mb-6 text-black"
            variants={item}
          >
            Telegram Marketing Suite
          </motion.h2>
          <motion.p 
            className="text-xl text-black max-w-2xl mx-auto"
            variants={item}
          >
            Promote your memecoin project across Telegram groups with our powerful marketing tools
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
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

        <motion.div 
          className="flex justify-center"
          variants={item}
        >
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 max-w-2xl w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-6 sm:mb-0">
                <h3 className="text-xl font-bold mb-2">Free vs Premium</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-zinc-200 mr-2"></div>
                    <span className="text-zinc-600">Limited (max 3 messages)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                    <span className="font-medium">Unlimited messaging</span>
                  </div>
                </div>
              </div>
              <Link href="/telegram">
                <button className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold overflow-hidden rounded-full bg-black text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-black border-2 border-black">
                  <span className="relative flex items-center gap-2">
                    Try It Now
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
