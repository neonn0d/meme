import { Shield, Wallet, Code, MessageCircle, Crown } from "lucide-react";

export default function Terms() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-4xl space-y-12 sm:space-y-16">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-base text-zinc-600">
              Please read these terms carefully before using our service.
            </p>
          </div>

          {/* Website Generation & Ownership */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <Code className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Website Generation & Ownership</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                <div className="space-y-4">
                  <p className="text-base text-zinc-600">
                    When you generate a website using our service:
                  </p>
                  <ul className="grid gap-3">
                    {[
                      "You retain full ownership of the generated website and its content",
                      "You can preview the website before finalizing the generation",
                      "The quality of generated websites is tested and verified",
                      "Payment for website generation is processed through Solana blockchain"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="text-sm text-zinc-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Payments & Refunds */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <Wallet className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Payments & Transactions</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                <div className="space-y-4">
                  <p className="text-base text-zinc-600">
                    All transactions are processed through the Solana blockchain:
                  </p>
                  <ul className="grid gap-3">
                    {[
                      "All payments are processed on-chain and are irreversible by nature",
                      "Transaction fees are determined by the Solana network",
                      "Service fees are clearly displayed before confirmation",
                      "Due to the nature of blockchain transactions, we cannot process refunds"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="text-sm text-zinc-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <Shield className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Acceptable Use</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                <div className="space-y-4">
                  <p className="text-base text-zinc-600">
                    To maintain a safe environment for all users:
                  </p>
                  <ul className="grid gap-3">
                    {[
                      "We do not support the generation of websites for illegal activities",
                      "Names suggesting scams or malicious intent are not permitted",
                      "We reserve the right to terminate service for violations",
                      "Users will be notified of any violations and reasons for termination"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="text-sm text-zinc-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription Terms */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <Crown className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Premium Subscription</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                <div className="space-y-4">
                  <p className="text-base text-zinc-600">
                    Current premium subscription terms:
                  </p>
                  <ul className="grid gap-3">
                    {[
                      "Premium access is valid for one month",
                      "Manual renewal required after expiration",
                      "Subscription terms may be updated with token launch",
                      "Future premium access may be granted through token holdings"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="text-sm text-zinc-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* Final Note */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                <div className="max-w-2xl mx-auto space-y-4 text-center">
                  <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900">
                    Built for the community
                  </h3>
                  <p className="text-sm text-zinc-600">
                    We strive to provide the best possible service while maintaining the highest standards of integrity in the crypto space.
                  </p>
                  <div className="inline-flex items-center space-x-1.5 text-sm font-medium text-zinc-800">
                    <span>Your project.</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                    <span>Your rules.</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                    <span>Your success.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Get in Touch</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                <p className="text-base text-zinc-600">
                  Have questions about our terms? Join our{" "}
                  <a 
                    href="https://discord.gg/UHDdNH574Y" 
                    className="font-medium text-zinc-900 hover:text-zinc-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord community
                  </a>
                  {" "}and we'll be happy to help.
                </p>
              </div>
            </div>
          </section>

          <div className="text-sm text-center text-zinc-500 pt-8">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
