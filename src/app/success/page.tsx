'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { FiDownload, FiGlobe, FiGithub, FiHelpCircle, FiCode } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    // Trigger confetti animation on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 sm:h-16 w-12 sm:w-16 rounded-full bg-green-100 mb-6 sm:mb-8">
            <FiDownload className="h-6 sm:h-8 w-6 sm:w-8 text-green-600" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Website Generated Successfully!
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Your custom memecoin website has been generated and downloaded. You're ready to launch! 🚀
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-zinc-200"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FiDownload className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                <h3 className="text-base sm:text-lg font-semibold">Download Your Files</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-left">
                Your website files have been downloaded automatically. They include everything you need to deploy your site.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-zinc-200"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FiGlobe className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
                <h3 className="text-base sm:text-lg font-semibold">Deploy Your Site</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-left">
                Upload these files to any web hosting service like Vercel, Netlify, or GitHub Pages to make your site live.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-zinc-200"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FiCode className="h-5 sm:h-6 w-5 sm:w-6 text-green-600 mr-2 sm:mr-3" />
                <h3 className="text-base sm:text-lg font-semibold">Customize Further</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-left">
                The generated files are clean and well-documented. Feel free to customize the code to match your needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-zinc-200"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <FiHelpCircle className="h-5 sm:h-6 w-5 sm:w-6 text-orange-600 mr-2 sm:mr-3" />
                <h3 className="text-base sm:text-lg font-semibold">Need Help?</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-left">
                Check out our documentation or reach out to our support team if you need assistance with deployment.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
              >
                Create Another Website
              </Link>
              <Link
                href="/guidelines"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                View Guidelines
              </Link>
            </div>
            <Link
              href="/setup-service"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-sm"
            >
              Need Help? We'll Set It Up 🛠️
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
