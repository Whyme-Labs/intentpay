import Link from 'next/link';
import { BRIDGE } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg" />
            <span className="font-bold text-xl">StackPay</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Testnet
            </span>
            <Link
              href="/create"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
            >
              Create Link
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
          Built for Stacks x USDCx Hackathon
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 text-transparent bg-clip-text">
          Cross-Chain Payment Links
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Accept USDC payments from Ethereum and receive USDCx on Stacks.
          One-click bridge via Circle xReserve.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/create"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105"
          >
            Create Payment Link
          </Link>
          <a
            href="https://docs.stacks.co/learn/bridging/usdcx"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-lg transition-all"
          >
            Learn About USDCx
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'Create Link',
              description: 'Enter your Stacks address and the USDC amount you want to receive.',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              ),
            },
            {
              step: '2',
              title: 'Share',
              description: 'Share the payment link or QR code with anyone who needs to pay you.',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              ),
            },
            {
              step: '3',
              title: 'Pay with USDC',
              description: 'Payer connects their EVM wallet and pays in USDC on Sepolia.',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              ),
            },
            {
              step: '4',
              title: 'Receive USDCx',
              description: `USDCx arrives on Stacks in ~${BRIDGE.ESTIMATED_PEGIN_MINUTES} minutes via Circle xReserve.`,
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/10 to-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600">
                {item.icon}
              </div>
              <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Step {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why StackPay?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'No Stacks Wallet Required',
                description: 'Payers only need an Ethereum wallet. Perfect for onboarding new users to Stacks ecosystem.',
                gradient: 'from-orange-500 to-red-500',
              },
              {
                title: 'Powered by Circle xReserve',
                description: 'Secure, institutional-grade bridging infrastructure. Your funds are safe.',
                gradient: 'from-purple-500 to-blue-500',
              },
              {
                title: 'Real-Time Tracking',
                description: 'Watch your payment progress from Ethereum to Stacks with live status updates.',
                gradient: 'from-green-500 to-teal-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mb-4`} />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Technical Details</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Built on proven infrastructure for reliable cross-chain payments
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Source Chain: Ethereum Sepolia
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>USDC Contract</span>
                <code className="font-mono text-xs">0x1c7d...7238</code>
              </li>
              <li className="flex justify-between">
                <span>xReserve Contract</span>
                <code className="font-mono text-xs">0x0088...44a2</code>
              </li>
              <li className="flex justify-between">
                <span>Remote Domain</span>
                <code className="font-mono text-xs">10003 (Stacks)</code>
              </li>
            </ul>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              Destination Chain: Stacks Testnet
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>USDCx Contract</span>
                <code className="font-mono text-xs">ST3JDZ...usdcx-v1</code>
              </li>
              <li className="flex justify-between">
                <span>Peg-in Time</span>
                <span>~{BRIDGE.ESTIMATED_PEGIN_MINUTES} minutes</span>
              </li>
              <li className="flex justify-between">
                <span>Minimum Amount</span>
                <span>{BRIDGE.MIN_DEPOSIT_USDC} USDC</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="p-12 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Accept Cross-Chain Payments?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Create your first payment link in seconds. No sign-up required.
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Create Payment Link
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-purple-600 rounded-md" />
              <span className="font-semibold">StackPay Links</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a
                href="https://dorahacks.io/hackathon/stacks-usdcx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                Stacks x USDCx Hackathon
              </a>
              <a
                href="https://docs.stacks.co/learn/bridging/usdcx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                USDCx Docs
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                GitHub
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Built for the Stacks ecosystem
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
