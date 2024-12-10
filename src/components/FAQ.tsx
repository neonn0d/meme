'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is BUIDL?",
    answer: "BUIDL is a meme token website generator that helps you create professional websites in minutes. Simply choose a template, customize it with your token details, and get your website files instantly."
  },
  {
    question: "How does BUIDL work?",
    answer: "Choose from our templates (Pepe, Moon, Classic), input your token details and content, and we'll generate your website. You'll get a zip file with all the necessary files ready to host."
  },
  {
    question: "Do we host your website?",
    answer: "No, we provide you with the website files in a zip format. You can easily host these files on platforms like Vercel or Netlify (they have free plans) or any web hosting service of your choice."
  },
  {
    question: "What's included in the templates?",
    answer: "Our templates include everything a memecoin needs: Token info display, price charts, buy buttons, tokenomics section, roadmap, team profiles, meme gallery, and social links. All templates are mobile-friendly and optimized for performance."
  },
  {
    question: "How much does it cost?",
    answer: "We have two pricing options: Standard generation at 0.05 SOL per website, or Premium at 0.01 SOL which gives you access to all premium features and templates. Choose the plan that best fits your needs."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [heightMap, setHeightMap] = useState<{ [key: number]: number }>({});
  const answerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const updateHeight = (index: number) => {
    if (answerRefs.current[index]) {
      setHeightMap(prev => ({
        ...prev,
        [index]: answerRefs.current[index]?.scrollHeight || 0
      }));
    }
  };

  const setRef = (el: HTMLDivElement | null, index: number) => {
    answerRefs.current[index] = el;
  };

  return (
    <section className="py-20 bg-black" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Everything you need to know about BUIDL
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-gray-800 bg-[#111111] hover:bg-[#141414] transition-colors duration-200"
            >
              <button
                className="w-full text-left focus:outline-none"
                onClick={() => {
                  updateHeight(index);
                  setActiveIndex(activeIndex === index ? null : index);
                }}
              >
                <div className="px-8 py-6 flex justify-between items-center">
                  <span className="text-[19px] font-medium text-white">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="ml-6 flex-shrink-0"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.span>
                </div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: activeIndex === index ? heightMap[index] || "auto" : 0,
                  opacity: activeIndex === index ? 1 : 0
                }}
                transition={{
                  height: { duration: 0.2, ease: "easeOut" },
                  opacity: { duration: 0.2, ease: "easeInOut" }
                }}
                className="overflow-hidden bg-[#1a1a1a]"
                style={{ pointerEvents: activeIndex === index ? "auto" : "none" }}
              >
                <div
                  ref={(el) => setRef(el, index)}
                  className="px-8 py-6 border-t border-gray-800"
                >
                  <p className="text-gray-400 text-[17px] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
