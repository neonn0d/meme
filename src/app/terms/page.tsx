

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mx-auto space-y-8">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              Terms of Service
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Please read these terms carefully before using our service.
            </p>
          </div>

          {/* Website Generation & Ownership */}
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Website Generation & Ownership</h2>
              <div className="bg-white p-4 border-b border-gray-200">
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
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Payments & Transactions</h2>
              <div className="bg-white p-4 border-b border-gray-200">
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
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Acceptable Use</h2>
              <div className="bg-white p-4 border-b border-gray-200">
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
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Premium Subscription</h2>
              <div className="bg-white p-4 border-b border-gray-200">
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
          <section>
            <div>
              <div className="bg-white p-4 border-t border-b border-gray-200">
                <div className="max-w-2xl mx-auto space-y-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">
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
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Get in Touch</h2>
              <div className="bg-white p-4 border-b border-gray-200">
                <p className="text-base text-zinc-600">
                  Have questions about our terms? Join our{" "}
                  <a 
                    href="https://t.me/buidl_community" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Telegram community
                  </a>
                  {" "}and we'll be happy to help.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
