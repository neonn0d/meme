'use client';
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex h-max min-h-screen py-20 items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          elements: {
            card: 'shadow-lg',
          },
        }}
        routing="hash"
      />
      <style jsx global>{`
        .cl-internal-b3fm6y {
          display: none !important; /* Hides the badge */
        }
      `}</style>
    </div>
  );
}
