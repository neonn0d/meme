import { motion } from 'framer-motion';
import { FiCheck, FiMessageCircle } from 'react-icons/fi';
import { FaTelegram, FaTwitter, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

interface SetupSuccessProps {
  onClose?: () => void;
}

export default function SetupSuccess({ onClose }: SetupSuccessProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full max-w-md"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000000_0%,#ffffff15_100%)] opacity-50"></div>
          <div className="relative">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiCheck className="h-8 w-8" strokeWidth={3} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-white/90">Thank you for choosing our setup service</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-5 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Next Steps</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Please contact us on any of these platforms to begin your setup process:
              </p>
            </div>

            <div className="space-y-3">
              {/* Telegram */}
              <a
                href="https://t.me/b0tstepfather"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all hover:shadow-sm group"
              >
                <div className="bg-white rounded-lg p-2 shadow-sm group-hover:shadow">
                  <FaTelegram className="h-5 w-5 text-blue-500" />
                </div>
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
                className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all hover:shadow-sm group"
              >
                <div className="bg-white rounded-lg p-2 shadow-sm group-hover:shadow">
                  <FaTwitter className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Twitter</p>
                  <p className="text-sm text-gray-500">@b0tstepfather</p>
                </div>
              </a>

              {/* Discord */}
              <div className="flex items-center p-4 bg-blue-50 rounded-xl group">
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <FaDiscord className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Discord</p>
                  <p className="text-sm text-gray-500">@b0tstepfather</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 rounded-lg p-1.5">
                  <FiMessageCircle className="h-4 w-4 text-yellow-700" />
                </div>
                <div>
                  <p className="text-sm text-yellow-800">
                    Please have your transaction ID and hosting preferences ready when you contact us.
                  </p>
                </div>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="block w-full text-center py-3 px-4 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
