# MemeGen - Memecoin Website Generator

MemeGen is a powerful, user-friendly platform that allows users to create professional memecoin websites with ease. Built with Next.js 14, TypeScript, and Solana blockchain integration, it offers a seamless experience for creating and customizing memecoin landing pages.

## 🚀 Features

- **Dynamic Website Generation**: Create custom memecoin websites with live preview
- **Mobile/Desktop Preview**: Toggle between mobile and desktop views in real-time
- **Secure Template System**: Built-in template system with sanitized input handling
- **Solana Integration**: Native Solana wallet integration for payments
- **Premium Subscriptions**: Monthly subscription system for advanced features
- **Payment History**: Track all your transactions and subscription status
- **Customization Options**:
  - Basic Information
  - Color Schemes
  - Team Members
  - Roadmap
  - Tokenomics
  - Social Links

## 💻 Tech Stack

- **Frontend**: Next.js 14.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Blockchain**: Solana Web3.js
- **State Management**: React Hooks
- **Deployment**: Vercel (recommended)

## 🛠️ Prerequisites

- Node.js 18.x or later
- npm or yarn
- Solana CLI tools (optional)
- A Clerk account for authentication
- A Solana wallet (Phantom recommended)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_MERCHANT_WALLET=your_merchant_wallet_address

NEXT_PUBLIC_SOLANA_PRICE=0.001
NEXT_PUBLIC_SETUP_SERVICE_PRICE=0.001
NEXT_PUBLIC_PREMIUM_AMOUNT=0.001
\`\`\`

## 🚀 Getting Started

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/memegen.git
   cd memegen
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Available Pages

- **/**: Landing page
- **/dashboard**: Main dashboard
- **/customize**: Website customization interface
- **/preview**: Live website preview
- **/history**: Payment and subscription history

## 💎 Premium Features

- Advanced template customization
- Priority support
- Custom domain integration (coming soon)
- Advanced analytics (coming soon)

## 🔐 Security Features

- Input sanitization
- Safe JSON parsing
- URL parameter validation
- Content Security Policy implementation
- Secure template rendering

## 🎨 Customization Options

### Basic Information
- Project name
- Token symbol
- Description
- Logo upload
- Header image

### Design
- Primary color
- Secondary color
- Accent colors
- Font selections

### Content Sections
- Team members
- Roadmap items
- Tokenomics
- Social media links

## 💰 Payment System

The platform uses Solana for all payments:
- One-time setup fee: 0.001 SOL
- Premium subscription: 0.001 SOL/month
- Template customization: 0.001 SOL

## 🔄 State Management

The application uses React's Context API and hooks for state management:
- User authentication state
- Customization form state
- Preview state
- Payment history

## 🌐 API Routes

- **/api/payments**: Payment history and processing
- **/api/preview**: Template preview generation
- **/api/customize**: Template customization
- **/api/subscription**: Subscription management

## 📝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email support@memegen.com or join our Discord server.
