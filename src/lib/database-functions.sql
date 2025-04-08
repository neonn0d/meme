-- Generic function to increment a numeric value in any table
CREATE OR REPLACE FUNCTION increment_value(row_id UUID, table_name TEXT, column_name TEXT, increment_amount FLOAT)
RETURNS FLOAT AS $$
DECLARE
  current_value FLOAT;
  new_value FLOAT;
BEGIN
  EXECUTE format('SELECT COALESCE(%I, 0) FROM %I WHERE user_id = $1', column_name, table_name)
  INTO current_value
  USING row_id;
  
  new_value := current_value + increment_amount;
  
  EXECUTE format('UPDATE %I SET %I = $1 WHERE user_id = $2', table_name, column_name)
  USING new_value, row_id;
  
  RETURN new_value;
END;
$$ LANGUAGE plpgsql;

-- Function to add a payment to a user's payments array
CREATE OR REPLACE FUNCTION add_payment_to_user(user_id_param UUID, payment_data JSONB)
RETURNS VOID AS $$
DECLARE
  current_payments JSONB;
BEGIN
  -- Get current payments array
  SELECT COALESCE(payments, '[]'::jsonb) INTO current_payments
  FROM user_public_metadata
  WHERE user_id = user_id_param;
  
  -- Update with new payment
  UPDATE user_public_metadata
  SET payments = current_payments || payment_data
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to create a website entry and increment counter
CREATE OR REPLACE FUNCTION create_website_and_increment(
  user_id_param UUID,
  template_id_param TEXT,
  coin_name_param TEXT,
  description_param TEXT,
  ticker_param TEXT,
  website_url_param TEXT,
  telegram_url_param TEXT,
  twitter_url_param TEXT,
  contract_address_param TEXT,
  logo_url_param TEXT
)
RETURNS UUID AS $$
DECLARE
  website_id UUID;
BEGIN
  -- Create website entry
  INSERT INTO websites (
    user_id, template_id, coin_name, description, ticker,
    website_url, telegram_url, twitter_url, contract_address, logo_url
  ) VALUES (
    user_id_param, template_id_param, coin_name_param, description_param, ticker_param,
    website_url_param, telegram_url_param, twitter_url_param, contract_address_param, logo_url_param
  )
  RETURNING id INTO website_id;
  
  -- Increment website count
  PERFORM increment_value(user_id_param, 'user_public_metadata', 'total_generated', 1);
  
  RETURN website_id;
END;
$$ LANGUAGE plpgsql;
