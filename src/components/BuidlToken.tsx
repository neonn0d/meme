import { motion } from "framer-motion";
import { Sparkles, Crown, Infinity, Layout, Zap } from "lucide-react";

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

export default function BuidlToken() {
  const features = [
    {
      title: "Premium Access",
      description: "Unlock all premium features with $BUIDL token",
      icon: <Crown className="h-7 w-7" aria-hidden="true" />
    },
    {
      title: "Unlimited Sites",
      description: "No limits on website generation",
      icon: <Infinity className="h-7 w-7" aria-hidden="true" />
    },
    {
      title: "Pro Templates",
      description: "Access our collection of premium templates",
      icon: <Layout className="h-7 w-7" aria-hidden="true" />
    },
    {
      title: "Beta Features",
      description: "Early access to new features and tools",
      icon: <Zap className="h-7 w-7" aria-hidden="true" />
    }
  ];

  return (
    <section className="py-24 bg-zinc-50">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <div className="text-center">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </motion.div>

          <motion.h2 
            variants={item}
            className="text-4xl md:text-5xl font-bold text-black mb-6"
          >
            $BUIDL Token
          </motion.h2>
          <motion.p 
            variants={item}
            className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-12"
          >
            Hold {process.env.NEXT_PUBLIC_PREMIUM_AMOUNT} SOL worth of $BUIDL tokens to unlock all features. Build unlimited meme websites with our most advanced tools.
          </motion.p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative mx-auto max-w-7xl">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="relative group"
              >
                <div className="h-full relative p-8 rounded-2xl bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-300">
                  <div className="inline-flex p-3 rounded-xl bg-black group-hover:bg-white mb-6 text-white group-hover:text-black transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
