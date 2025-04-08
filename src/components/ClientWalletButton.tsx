'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

interface ClientWalletButtonProps {
  className?: string;
}

export default function ClientWalletButton({ className = '' }: ClientWalletButtonProps) {
  return <WalletMultiButton className={className} />;
}
