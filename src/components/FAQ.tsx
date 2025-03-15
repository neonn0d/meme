"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What is BUIDL?",
    answer:
      "BUIDL is a meme token website generator that helps you create professional websites in minutes. Simply choose a template, customize it with your token details, and get your website files instantly.",
  },
  {
    question: "How does BUIDL work?",
    answer:
      "Choose from our templates (Pepe, Moon, Classic), input your token details and content, and we'll generate your website. You'll get a zip file with all the necessary files ready to host.",
  },
  {
    question: "Do we host your website?",
    answer:
      "No, we provide you with the website files in a zip format. You can easily host these files on platforms like Vercel or Netlify (they have free plans) or any web hosting service of your choice.",
  },
  {
    question: "What's included in the templates?",
    answer:
      "Our templates include everything a memecoin needs: Token info display, buy buttons, tokenomics section, roadmap, team profiles, FAQ, and social links. All templates are mobile-friendly and optimized for performance.",
  },
  {
    question: "How much does it cost?",
    answer:
      "We have two pricing options: Standard generation at 0.1 SOL per website, or Premium at 0.25 SOL which gives you access to all premium features and templates. Choose the plan that best fits your needs.",
  },
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [heightMap, setHeightMap] = useState<{ [key: number]: number }>({})
  const answerRefs = useRef<Array<HTMLDivElement | null>>([])

  const updateHeight = (index: number) => {
    if (answerRefs.current[index]) {
      setHeightMap((prev) => ({
        ...prev,
        [index]: answerRefs.current[index]?.scrollHeight || 0,
      }))
    }
  }

  const setRef = (el: HTMLDivElement | null, index: number) => {
    answerRefs.current[index] = el
  }

  return (
    <section className="py-24 bg-zinc-100 border-t border-zinc-200" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Everything you need to know about BUIDL
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-zinc-200 bg-white hover:bg-zinc-50/50 transition-colors duration-200"
            >
              <button
                className="w-full text-left focus:outline-none"
                onClick={() => {
                  updateHeight(index)
                  setActiveIndex(activeIndex === index ? null : index)
                }}
              >
                <div className="px-6 py-4 flex justify-between items-center">
                  <span className="text-lg font-medium text-zinc-900">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="ml-6 flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-zinc-500" />
                  </motion.span>
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: activeIndex === index ? heightMap[index] || "auto" : 0,
                  opacity: activeIndex === index ? 1 : 0,
                }}
                transition={{
                  height: { duration: 0.2, ease: "easeOut" },
                  opacity: { duration: 0.2, ease: "easeInOut" },
                }}
                className="overflow-hidden"
                style={{
                  pointerEvents: activeIndex === index ? "auto" : "none",
                }}
              >
                <div ref={(el) => setRef(el, index)} className="px-6 pb-4">
                  <p className="text-zinc-600 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
