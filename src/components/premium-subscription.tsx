"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentRecord } from "@/types/payment";
import PaymentModal from "./PaymentModal";

// Dynamically import WalletMultiButton with ssr disabled
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface PremiumSubscriptionProps {
  onPaymentSuccess?: () => void;
}

export default function PremiumSubscription({
  onPaymentSuccess,
}: PremiumSubscriptionProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [modalState, setModalState] = useState<"success" | "error">("success");

  const MERCHANT_WALLET = process.env.NEXT_PUBLIC_MERCHANT_WALLET || "";
  const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const RPC_ENDPOINT =
    process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ||
    "https://api.devnet.solana.com";
  const PREMIUM_AMOUNT = Number(
    process.env.NEXT_PUBLIC_PREMIUM_AMOUNT || "0.01"
  ); // SOL

  const calculateExpiryDate = (startDate: number): number => {
    const startDateTime = new Date(startDate);
    const expiryDateTime = new Date(startDate);
    expiryDateTime.setMonth(expiryDateTime.getMonth() + 1);

    // Handle edge cases where the next month has fewer days
    const startDay = startDateTime.getDate();
    const lastDayOfNextMonth = new Date(
      expiryDateTime.getFullYear(),
      expiryDateTime.getMonth() + 1,
      0
    ).getDate();

    // If the start day is greater than the last day of next month,
    // set it to the last day of next month
    if (startDay > lastDayOfNextMonth) {
      expiryDateTime.setDate(lastDayOfNextMonth);
    }

    return expiryDateTime.getTime();
  };

  const recordPayment = async (hash: string) => {
    try {
      const timestamp = Date.now();
      const payment: PaymentRecord = {
        amount: PREMIUM_AMOUNT,
        timestamp,
        type: "premium",
        transactionHash: hash,
        status: "completed",
        network: NETWORK,
        expiryDate: calculateExpiryDate(timestamp),
      };

      if (!userProfile?.wallet_address) {
        throw new Error('No wallet address available');
      }

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userProfile.wallet_address}`
        },
        body: JSON.stringify({ payment }),
      });

      if (!response.ok) {
        throw new Error("Failed to record payment");
      }

      // Call the success callback if provided
      onPaymentSuccess?.();
    } catch (err) {
      console.error("Error recording payment:", err);
      throw new Error("Failed to record payment metadata");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTransactionHash(null);
  };

  const handlePayment = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const connection = new Connection(RPC_ENDPOINT, "confirmed");
      const merchantWallet = new PublicKey(MERCHANT_WALLET);
      
      // Create an unsigned transaction
      const transaction = new Transaction();
      
      // Add the transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: merchantWallet,
          lamports: PREMIUM_AMOUNT * LAMPORTS_PER_SOL,
        })
      );
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Use the recommended signAndSendTransaction method from Phantom
      // This avoids the "malicious dApp" warning
      // @ts-ignore - Phantom types are not included in the default TypeScript definitions
      const provider = window.phantom?.solana;
      
      if (!provider) {
        throw new Error("Phantom wallet not found");
      }
      
      const { signature } = await provider.signAndSendTransaction(transaction);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed");

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      // Record the successful payment and show modal first
      setTransactionHash(signature);
      setModalState("success");
      setShowModal(true);

      // Then record the payment and trigger callback
      await recordPayment(signature);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
      setModalState("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex lg:items-center justify-between gap-4 flex-col md:flex-row ">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-zinc-900">
          Premium Subscription
        </h3>
        <p className="text-sm text-zinc-600 mt-1">
          Get access to all premium features for just <b>${PREMIUM_AMOUNT}</b> SOL/month
        </p>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      <div className="flex lg:items-center gap-2 items-start justify-start w-full md:w-max">
        {!publicKey ? (
          <WalletMultiButton />
        ) : (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Processing...
              </>
            ) : (
              "Upgrade Now"
            )}
          </button>
        )}
      </div>

      <PaymentModal
        isOpen={showModal}
        onClose={handleModalClose}
        state={modalState}
        transactionHash={transactionHash || undefined}
        errorMessage={error || undefined}
      />
    </div>
  );
}
