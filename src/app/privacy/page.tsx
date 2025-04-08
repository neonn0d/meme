

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Your trust matters. Here's how we handle your information at BUIDL.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-10">
          {/* Authentication Section */}
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Sign In & Authentication</h2>
              <div className="bg-white p-4 border-b border-gray-200">
                <p className="text-base text-zinc-600 mb-6">
                  We use Solana wallet authentication to provide a secure and decentralized sign-in experience. This means:
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Your private keys never leave your wallet",
                    "We only store your public wallet address",
                    "Authentication is handled through secure signatures",
                    "No passwords or personal information is required"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span className="text-sm text-zinc-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Data Collection Section */}
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Data We Collect</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Wallet Authentication",
                    items: ["Public wallet address", "Transaction signatures"]
                  },
                  {
                    title: "Wallet Connection",
                    items: ["Just your public address", "Never your private keys"]
                  },
                  {
                    title: "On-Chain Data",
                    items: ["Public transaction hashes", "Subscription timestamps"]
                  },
                  {
                    title: "Privacy First",
                    items: ["Zero tracking", "Zero personal data"]
                  }
                ].map((category, i) => (
                  <div key={i} className="bg-white p-3 border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">{category.title}</h3>
                    <ul className="space-y-1">
                      {category.items.map((item, j) => (
                        <li key={j} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Blockchain Data Section */}
          <section>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-3">Blockchain Transparency</h2>
              <div className="bg-white p-4 border-b border-gray-200">
                <p className="text-base text-zinc-600 leading-7">
                  When you make a payment for website generation or premium subscription, the following information becomes part of the Solana blockchain:
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Payment transaction hash",
                    "Transaction timestamp"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-zinc-500">
                  Note: All transactions are recorded on the Solana blockchain. We only track your subscription status 
                  for service provision.
                </p>
              </div>
            </div>
          </section>

          {/* Our Promise Section */}
          <section>
            <div>
              <div className="bg-white px-4 py-3 border-t border-b border-gray-200">
                <div className="max-w-2xl mx-auto space-y-2 text-center">
                  <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900">
                    Built by degens, for degens.
                  </h3>
                  <p className="text-sm text-zinc-600">
                    We respect your privacy and only interact with public on-chain data.
                  </p>
                  <div className="inline-flex items-center space-x-1.5 text-sm font-medium text-zinc-800">
                    <span>Your keys.</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                    <span>Your coins.</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                    <span>Your data.</span>
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
                  Have questions about our privacy practices? Join our{" "}
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
