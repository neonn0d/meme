'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiMessageCircle } from 'react-icons/fi';
import { FaTelegram, FaTwitter, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

export default function SetupSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-white/90">Thank you for choosing our setup service</p>
          </div>

          {/* Next Steps */}
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h2>
                <p className="text-gray-600">
                  Please contact us on any of these platforms to begin your setup process:
                </p>
              </div>

              <div className="space-y-3">
                {/* Telegram */}
                <a
                  href="https://t.me/b0tstepfather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <FaTelegram className="h-6 w-6 text-blue-500" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Telegram</p>
                    <p className="text-sm text-gray-500">@b0tstepfather</p>
                  </div>
                </a>

                {/* Twitter */}
                <a
                  href="https://twitter.com/b0tstepfather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <FaTwitter className="h-6 w-6 text-blue-500" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Twitter</p>
                    <p className="text-sm text-gray-500">@b0tstepfather</p>
                  </div>
                </a>

                {/* Discord */}
                <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                  <FaDiscord className="h-6 w-6 text-blue-500" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Discord</p>
                    <p className="text-sm text-gray-500">@b0tstepfather</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <div className="flex items-start">
                  <FiMessageCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Please have your transaction ID and hosting preferences ready when you contact us.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/guidelines"
                className="block w-full text-center py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                Return to Guidelines
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
