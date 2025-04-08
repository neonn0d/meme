-- Database schema for Solana wallet authentication

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User public metadata table
CREATE TABLE IF NOT EXISTS user_public_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  websites JSONB DEFAULT '[]'::JSONB,
  total_generated INTEGER DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  payments JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User private metadata table
CREATE TABLE IF NOT EXISTS user_private_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  telegram_sessions JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan TEXT NOT NULL DEFAULT 'monthly',
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  coin_name TEXT NOT NULL,
  description TEXT,
  ticker TEXT,
  website_url TEXT,
  telegram_url TEXT,
  twitter_url TEXT,
  contract_address TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_public_metadata_user_id ON user_public_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_user_private_metadata_user_id ON user_private_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);

-- Create RLS (Row Level Security) policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_public_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_private_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create policies for user_public_metadata table
CREATE POLICY "Users can view their own public metadata" ON user_public_metadata
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own public metadata" ON user_public_metadata
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_private_metadata table
CREATE POLICY "Users can view their own private metadata" ON user_private_metadata
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own private metadata" ON user_private_metadata
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for subscriptions table
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policies for websites table
CREATE POLICY "Users can view their own websites" ON websites
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own websites" ON websites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own websites" ON websites
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own websites" ON websites
  FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_user_public_metadata_modtime
BEFORE UPDATE ON user_public_metadata
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_user_private_metadata_modtime
BEFORE UPDATE ON user_private_metadata
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_subscriptions_modtime
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_websites_modtime
BEFORE UPDATE ON websites
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
