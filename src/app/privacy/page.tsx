import { Shield, Users, Database, Blocks, MessageCircle } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg text-zinc-600">
            Your trust matters. Here's how we handle your information at BUIDL.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Authentication Section */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <Users className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Sign In & Authentication</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                <p className="text-base text-zinc-600 mb-6">
                  We've partnered with Clerk, a trusted authentication provider, to handle your sign-ins 
                  securely through Discord and Twitter. This means:
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Your social login credentials are never stored on our servers",
                    "Profile information is managed securely by Clerk",
                    "You can easily connect or disconnect social accounts",
                    "Only public username and avatar are accessed"
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
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <Shield className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Data We Collect</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    title: "Social Auth",
                    items: ["Only public username", "Only public avatar"]
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
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
                    <h3 className="font-medium text-zinc-900 mb-2">{category.title}</h3>
                    <ul className="space-y-1">
                      {category.items.map((item, j) => (
                        <li key={j} className="text-sm text-zinc-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="relative mt-16">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-zinc-50 rounded-3xl transform -skew-y-1"></div>
              </div>
            </div>
          </section>

          {/* Blockchain Data Section */}
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-zinc-100 rounded-xl">
                  <Blocks className="w-6 h-6 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900">Blockchain Transparency</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
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
          <section className="relative">
            <div className="absolute -inset-x-4 -inset-y-6 z-0 bg-zinc-50 border border-zinc-200 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm ring-1 ring-zinc-900/5 border border-zinc-200">
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
                  Have questions about our privacy practices? Join our{" "}
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
