# Solana Payment System Documentation

## Overview

This document outlines the implementation of the Solana payment system for the meme website generator. The system handles two types of payments:

1. **Website Generation Payments**: One-time payments to generate a website
2. **Subscription Payments**: Recurring payments (monthly or yearly) for premium features

## Database Structure

The payment system uses the following database tables:

### 1. users
- Stores basic user information
- Contains wallet address for Solana authentication

### 2. user_public_metadata
- Stores user payment history in a `payments` JSON array
- Tracks `total_spent` for all payments
- Tracks `total_generated` count for websites created

### 3. subscriptions
- Stores subscription information
- Fields:
  - `user_id`: Reference to the user
  - `status`: Current status (active, inactive, etc.)
  - `plan`: Subscription type (monthly, yearly)
  - `current_period_start`: Start date of current billing period
  - `current_period_end`: End date of current billing period
  - `cancel_at_period_end`: Whether to cancel at period end
  - `created_at`: Creation timestamp
  - `updated_at`: Last update timestamp

### 4. websites
- Stores information about generated websites
- Each record represents one website created by a user

## Payment Flow

### 1. User Initiates Payment
- User connects their Solana wallet
- Selects payment type (website or subscription)
- For subscriptions, selects plan (monthly or yearly)

### 2. Transaction Processing
- System creates a Solana transaction
- User signs the transaction with their wallet
- Transaction is sent to the blockchain
- System waits for confirmation

### 3. Database Updates
- For website payments:
  - Increments `total_generated` in user_public_metadata
  - Adds payment record to `payments` array
  - Updates `total_spent`

- For subscription payments:
  - Creates or updates record in subscriptions table
  - Sets appropriate start/end dates based on plan
  - Adds payment record to `payments` array
  - Updates `total_spent`

## Implementation Details

### SolanaPaymentModal Component
The main component that handles the payment UI and logic:
- Displays payment options
- Connects to user's wallet
- Creates and sends transactions
- Updates database records

Key functions:
- `handlePayment()`: Main function that processes payments
- `getPaymentAmount()`: Calculates payment amount based on type/plan

### Database Updates
When a payment is successful:

1. For website payments:
   - Fetches current website count
   - Increments count by 1
   - Updates user_public_metadata

2. For subscription payments:
   - Creates a new subscription record or updates existing one
   - Sets status to "active"
   - Sets current_period_start to current date
   - Sets current_period_end to 30 days later (monthly) or 365 days later (yearly)

3. For all payments:
   - Fetches current payments array
   - Adds new payment record with transaction details
   - Updates total_spent amount

## Testing

To test the payment system:

1. **Test API Endpoint**: `/api/test-subscription-direct`
   - Creates a test subscription record
   - Useful for verifying database integration

2. **Live Testing**:
   - Connect wallet in the application
   - Make a payment
   - Verify database records are created correctly

## Payment Amounts

- Website Generation: 0.001 SOL
- Monthly Subscription: 0.01 SOL
- Yearly Subscription: 0.1 SOL

## Security Considerations

- Uses Supabase Row Level Security (RLS) to protect user data
- Service role key used for admin operations
- Wallet signature verification for authentication
