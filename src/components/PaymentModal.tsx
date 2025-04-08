'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: 'success' | 'error';
  transactionHash?: string;
  errorMessage?: string;
}

export default function PaymentModal({ isOpen, onClose, state, transactionHash, errorMessage }: PaymentModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-50 m-auto h-fit w-full max-w-md bg-white p-6 shadow-lg sm:rounded-xl border border-gray-100"
                style={{ maxHeight: 'calc(100vh - 2rem)' }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {state === 'success' ? (
                    <>
                      <div className="rounded-full bg-green-50 p-4 border border-green-100 mb-2">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          Payment Successful
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-600">
                          Your transaction has been confirmed on the Solana blockchain.
                        </Dialog.Description>
                        {transactionHash && (
                          <div className="mt-2">
                            <a 
                              href={`https://explorer.solana.com/tx/${transactionHash}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-xs inline-flex items-center"
                            >
                              View on Solana Explorer
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="pt-4 w-full">
                        <button
                          onClick={onClose}
                          className="w-full rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4"
                        >
                          Continue
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-red-50 p-4 border border-red-100 mb-2">
                        <XCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          Payment Failed
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-600">
                          {errorMessage || 'There was an issue processing your transaction. Please try again.'}
                        </Dialog.Description>
                      </div>
                      <div className="pt-4 w-full">
                        <button
                          onClick={onClose}
                          className="w-full rounded-lg text-sm font-medium transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 py-2 px-4"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
