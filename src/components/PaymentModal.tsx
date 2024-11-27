'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: 'success' | 'error';
}

export default function PaymentModal({ isOpen, onClose, state }: PaymentModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-50 m-auto h-fit w-full max-w-lg bg-gradient-to-br from-white via-zinc-50/90 to-zinc-100 p-8 shadow-xl sm:rounded-2xl border border-zinc-200"
                style={{ 
                  maxHeight: 'calc(100vh - 2rem)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ 
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  {state === 'success' ? (
                    <>
                      <div className="rounded-full bg-green-100 p-3 ring-8 ring-green-50">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <Dialog.Title className="text-2xl font-bold text-zinc-900">
                          Payment Successful
                        </Dialog.Title>
                        <Dialog.Description className="text-zinc-600">
                          Your payment has been processed successfully. You now have access to premium features.
                        </Dialog.Description>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-red-100 p-3 ring-8 ring-red-50">
                        <XCircle className="w-12 h-12 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <Dialog.Title className="text-2xl font-bold text-zinc-900">
                          Payment Failed
                        </Dialog.Title>
                        <Dialog.Description className="text-zinc-600">
                          There was an error processing your payment. Please try again or contact support if the issue persists.
                        </Dialog.Description>
                      </div>
                      <button
                        onClick={() => onClose()}
                        className="px-8 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                    aria-label="Close"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
