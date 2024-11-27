'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import { SetupServicePayment } from '@/components/SetupServicePayment';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SetupServicePage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const router = useRouter();

  const handlePaymentSuccess = () => {
    toast.success('Thank you for your payment! We will contact you shortly.');
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/guidelines"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 group"
        >
          <FiArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Guidelines
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Professional Setup Service</h1>
            <p className="text-white/90">Let us handle your website deployment while you focus on your project</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Price and Features */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">One-time Payment</h2>
                <p className="text-gray-600">Complete deployment & configuration service</p>
              </div>
              <div className="bg-blue-50 px-6 py-3 rounded-xl">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-blue-600">0.2</span>
                  <span className="text-xl font-semibold text-blue-600">SOL</span>
                </div>
              </div>
            </div>

            {/* Service Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Included Services:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Complete Website Deployment</p>
                      <p className="text-sm text-gray-500">Full setup on your chosen platform</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Domain Configuration</p>
                      <p className="text-sm text-gray-500">DNS setup and domain connection</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">SSL Certificate</p>
                      <p className="text-sm text-gray-500">Secure HTTPS setup and verification</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Additional Benefits:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">24-hour Support</p>
                      <p className="text-sm text-gray-500">Direct assistance throughout setup</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Performance Optimization</p>
                      <p className="text-sm text-gray-500">Best practices implementation</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Technical Guidance</p>
                      <p className="text-sm text-gray-500">Platform-specific recommendations</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Prerequisites Notice */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-yellow-800 mb-2">Before Payment:</h3>
              <ul className="space-y-2 text-yellow-700">
                <li className="flex items-center">
                  <FiCheck className="h-4 w-4 mr-2" />
                  Purchase your domain from Namecheap or GoDaddy
                </li>
                <li className="flex items-center">
                  <FiCheck className="h-4 w-4 mr-2" />
                  Create GitHub account (for Vercel/Netlify) OR hosting account
                </li>
                <li className="flex items-center">
                  <FiCheck className="h-4 w-4 mr-2" />
                  Have all login credentials ready
                </li>
              </ul>
            </div>

            {/* Payment Button */}
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg flex items-center justify-center space-x-3 font-medium text-lg"
            >
              <span>Pay 0.2 SOL</span>
             
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Contact us on social media after payment for immediate assistance
            </p>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <SetupServicePayment
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
